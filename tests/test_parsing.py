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

import sys
import unittest
import re

from ecmasab.beparsing import BeParser, ParsingErrorException
from ecmasab.exceptions import UnreachableCodeException
from ecmasab.printers import PrintersFactory, PrinterType, CVC4Printer, JSV8Printer, JST262Printer, BePrinter
from tests.input_tests import examples, invalids

def parse_and_generate(example, valid):
    try:
        strp = open("%s.txt"%example,"r").read()

        printers = PrintersFactory.get_printers()

        parser = BeParser()
        program = parser.program_from_string(strp)

        if program.params:
            program.apply_param(dict(program.get_params()[0]))
        
        c4printer = PrintersFactory.printer_by_name(CVC4Printer().NAME)
        cprinters = PrintersFactory.get_printers_by_type(PrinterType.SMT)
        assert(c4printer in cprinters)

        c4printer.print_program(program)
        c4printer.print_data_type(program)
        c4printer.print_block_type(program)

        jprinters = PrintersFactory.get_printers_by_type(PrinterType.JS)

        jprinterV8 = PrintersFactory.printer_by_name(JST262Printer().NAME)
        assert(jprinterV8 in jprinters)
        jprog = jprinterV8.print_program(program)
        
        jprinterT2 = PrintersFactory.printer_by_name(JSV8Printer().NAME)
        assert(jprinterT2 in jprinters)
        jprog = jprinterT2.print_program(program)
        
    except Exception as e:
        if not valid:
            print(e)
            return
        else:
            raise

    if not valid:
        assert(False)
        
    if valid and not program.params:
        with open("%s/program.js"%example,"r") as f:
            a = f.read()
            b = jprog
            if a != b:
                print(example)
                print(a)
                print(b)
            assert a == b

        execsstr = open("%s/models.txt"%example,"r").read()
        execs = parser.executions_from_string(execsstr, program)
        eprint = c4printer.print_executions(execs)

        with open("%s/outputs.txt"%example,"r") as f:
            a = f.read().split("\n")
            b = jprinterV8.print_executions(program, execs).split("\n")
            a.sort()
            b.sort()
            assert a == b

        jprinterV8.print_program(program, execs)
        jprinterT2.print_program(program, execs)

        a = jprinterV8.compute_possible_executions(program, execs)
        b = jprinterT2.compute_possible_executions(program, execs)

        assert a == b
        
    assert True

def be_parsing(example):
    strp = open("%s.txt"%example,"r").read()

    parser = BeParser()
    program = parser.program_from_string(strp)

    beprinter = PrintersFactory.printer_by_name(BePrinter().NAME)
    beprogram = beprinter.print_program(program)
    strp = re.sub("\n+","\n",strp)
    strp = re.sub("//.*\n","",strp)

    strp = strp.replace(" ","")
    beprogram = beprogram.replace(" ", "")
    
    strp = re.sub(re.compile("Params\{.*\}", re.MULTILINE|re.DOTALL), '', strp)
    beprogram = re.sub(re.compile("Params\{.*\}", re.MULTILINE|re.DOTALL), '', beprogram)
    
    if not(strp == beprogram):
        print(example)
        print(strp)
        print(beprogram)
    
    assert(strp == beprogram)
    
def test_parsing():
    for example in examples:
        yield parse_and_generate, example, True
        yield be_parsing, example

    for invalid in invalids:
        yield parse_and_generate, invalid, False
        
if __name__ == "__main__":
    for example in examples:
        be_parsing(example)

    for example in examples:
        parse_and_generate(example, True)

    for invalid in invalids:
        parse_and_generate(invalid, False)
        
