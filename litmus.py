#!/usr/bin/env python

# Copyright 2017 Cristian Mattarei
#
# Licensed under the modified BSD (3-clause BSD) License.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import subprocess
import argparse
import sys
import multiprocessing
import signal
import time
from six.moves import range
from prettytable import PrettyTable
from ecmasab.printers import EPrinter
from ecmasab.parsing import BeParser
from ecmasab.utils import decompress_string
from ecmasab.models_evaluator import Evaluator, MatchType

K = "k"
M = "M"

class Config(object):
    command = None
    outputs = None
    input_file = None
    models = None
    number = None
    threads = None
    percent = None
    silent = None
    pretty = None

    def __init__(self):
        self.command = None
        self.outputs = None
        self.input_file = None
        self.models = None
        self.number = 10
        self.threads = 4
        self.percent = True
        self.silent = False
        self.pretty = True
    
def run_command(command, number, silent):

    try:
        outputs_dic = {}

        for i in range(number):

            process = subprocess.Popen(command, stdout=subprocess.PIPE, close_fds=True)
            out = process.communicate()[0]

            out = out.split(b"\n")
            out = [x.decode('utf-8') for x in out if x.decode('utf-8') != ""]
            out.sort()
            out = ";".join(out)

            if i > 0:
                if (i%1000) == 0:
                    if not silent: sys.stdout.write('k')
                    sys.stdout.flush()
                else:
                    if (i%100) == 0:
                        if not silent: sys.stdout.write('.')
                        sys.stdout.flush()


            if out not in outputs_dic:
                outputs_dic[out] = 1
            else:
                outputs_dic[out] += 1

        return outputs_dic

    except KeyboardInterrupt:
        raise KeyboardInterrupt()
    
def run_litmus(config):

    command = config.command.split(" ")
    number = config.number if type(config.number) == str else str(config.number)

    input_file_has_models = False
    
    if config.input_file:
        command.append(config.input_file)
    
    outputs_dic = {}

    factor = 1

    if K in number:
        number = number.replace(K,"")
        factor = factor * (10**3)

    if M in number:
        number = number.replace(M,"")
        factor = factor * (10**6)

    try:
        number = int(number)
    except Exception:
        number = 1
        
    number = int(number)*factor

    if config.outputs:
        try:
            with open(config.outputs, "r") as f:
                i = 1
                for line in f.readlines():
                    line = line.replace("\n","")
                    line = line.split(";")
                    line.sort()
                    line = ";".join(line)
                    outputs_dic[line] = [i, 0]
                    i += 1
                input_file_has_models = True
        except Exception:
            print("File not found \"%s\""%config.outputs)
            return 1
    else:
        try:
            modelstr = None
            with open(config.input_file, "r") as f:
                strfile = f.read()
                if EPrinter.DATA in strfile:
                    modelstr = strfile[strfile.find(EPrinter.DATA)+len(EPrinter.DATA):]
                    modelstr = modelstr.split("\n")
                    modelstr = [x[2:] for x in modelstr]
                    modelstr = "".join(modelstr)
            if modelstr is not None:
                input_file_has_models = True
                i = 1
                for line in decompress_string(modelstr).split("\n"):
                    model = line[line.find(EPrinter.MOD)+len(EPrinter.MOD):]
                    output = line[len(EPrinter.OUT):line.find(EPrinter.MOD)]
                    output = output.split(";")
                    output.sort()
                    output = ";".join(output)
                    outputs_dic[output] = [i, 0, model]
                    i += 1
        except Exception:
            print("Error while reading \"%s\""%config.input_file)
            return 1

    if not input_file_has_models:
        print("ERROR: the input file does not contain model information")
        return 0

    original_sigint_handler = signal.signal(signal.SIGINT, signal.SIG_IGN)
            
    num_t = config.threads
    pool = multiprocessing.Pool(num_t)
    async_results = []
    outputs_t = []
    
    signal.signal(signal.SIGINT, original_sigint_handler)
        
    for i in range(num_t):
        async_results.append(pool.apply_async(run_command, (command, int(number/num_t), config.silent)))

    if config.silent:
        sys.stdout.write("Running (x%s) \"%s\"..."%(number, " ".join(command)))
        sys.stdout.flush()
        
    try:
        if not config.silent: print("** Processing command \"%s\" **"%(" ".join(command)))
        if not config.silent: print("Running...")
        time.sleep(5)
        
    except KeyboardInterrupt:
        print("Caught KeyboardInterrupt, terminating workers")
        pool.terminate()
        return 1


    for i in range(num_t):
        outputs_t.append(async_results[i].get())
        
    not_matched = []
    for outputs in outputs_t:
        for el in outputs:
            if el not in outputs_dic:
                not_matched.append(el)
            else:
                outputs_dic[el][1] += outputs[el]

    not_matched = list(set(not_matched))

    results = [(outputs_dic[x][1], x) for x in outputs_dic]    
    results.sort()
    results.reverse()

    if not config.silent: sys.stdout.write('\n=== Results ===\n')
    sys.stdout.flush()

    lines = []
    
    for el in not_matched:
        if not config.silent: lines.append("NOT MATCHED OUTPUT ERROR: \"%s\""%el)

    if config.pretty:
        table = PrettyTable()

    mmatched = set([])

    matches = 0
    for result in results:
        if result[0] > 0:
            num = result[0] if not config.percent else float(float(result[0]*100)/float(number))
            res_val = result[1]
            row = None
            if config.percent:
                if not config.silent:
                    if config.pretty:
                        row = ["%.2f%%"%num] + res_val.split(";")
                    else:
                        lines.append("%.2f%%\t\"%s\""%(num, result[1]))
            else:
                if not config.silent:
                    if config.pretty:
                        row = [num] + res_val.split(";")
                    else:
                        lines.append("%s\t\"%s\""%(num, result[1]))
            matches += 1
            mmatched.add(tuple(outputs_dic[res_val]))
            if row:
                table.add_row(row)

    if (not config.silent) and (config.pretty):
        table.field_names = ["Frequency"] + ["Output %s"%(x+1) for x in range(len(results[0][1].split(";")))]
        table.align = "l"
        lines.append(str(table))

    if config.percent:
        if not config.silent: lines.append("Coverage: %.2f%%"%(float(float(matches*100)/float(len(results)))))
    else:
        if not config.silent: lines.append("Coverage: %s/%s"%(matches, len(results)))

    if not config.silent:
        print("\n".join(lines))

    if config.silent:
        if len(not_matched) > 0:
            print("FAIL")
            if not config.models:
                return 1
        else:
            print("ok")
            if not config.models:
                return 0

    if config.models:
        mmatched = [str(x[2]) for x in mmatched]
        amatched = [str(outputs_dic[x][2]) for x in outputs_dic]
        nmatched = [x for x in amatched if x not in mmatched]

        if config.silent:
            return (mmatched, nmatched)
        
        print("\n== Matched models ==")
        print("\n".join(mmatched))
        print("\n== Unmatched models ==")
        print("\n".join([x for x in nmatched if x not in mmatched]))
        
        beparser = BeParser()
        mmatched = beparser.executions_from_string("\n".join(mmatched))
        nmatched = beparser.executions_from_string("\n".join(nmatched))

        evaluator = Evaluator(mmatched, nmatched)
        emod = evaluator.differential_evaluation()
        
        print("\n== Missing (single) Reads Bytes From ==")
        out_str = ["%s := [%s]"%(x[0], ", ".join(x[1])) for x in emod.get_u_RBF(MatchType.UM)]
        out_str.sort()
        print("\n".join(out_str))

        print("\n== Difference Between Happens Before ==")
        print(", ".join(["(%s, %s)"%(x) for x in emod.get_u_HB(MatchType.UM)]))
            
if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Litmus tests checking.')

    parser.set_defaults(command=None)
    parser.add_argument('-c', '--command', metavar='command', type=str, required=True,
                       help='the command to be executed')

    parser.set_defaults(input_file=None)
    parser.add_argument('-i', '--input_file', metavar='input_file', type=str, required=False,
                       help='input file')
    
    parser.set_defaults(outputs=None)
    parser.add_argument('-o', '--outputs', metavar='outputs', type=str, required=False,
                       help='possible outputs')

    parser.set_defaults(models=False)
    parser.add_argument('-m', '--models', dest='models', action='store_true',
                       help='evaluates models')

    parser.set_defaults(number="100")
    parser.add_argument('-n', '--number', metavar='number', type=str, 
                       help='total executions')

    parser.set_defaults(threads=1)
    parser.add_argument('-j', '--threads', metavar='number', type=int,
                       help='number of threads')

    parser.set_defaults(silent=False)
    parser.add_argument('-s', '--silent', dest='silent', action='store_true',
                       help='show only PASS/FAIL')
    
    parser.set_defaults(percent=True)
    parser.add_argument('-t', '--total', dest='percent', action='store_false',
                       help='show the total number of matches')

    
    if len(sys.argv)==1:
        parser.print_help()
        sys.exit(1)

    args = parser.parse_args()

    config = Config()
    
    config.command = args.command
    config.outputs = args.outputs
    config.input_file = args.input_file
    config.number = args.number
    config.threads = args.threads
    config.percent = args.percent
    config.silent = args.silent
    config.models = args.models

    sys.exit(run_litmus(config))
