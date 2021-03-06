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
import shutil
import os

from emme import Config, analyze_program, ALL
from tests.input_tests import examples, ex_fast

tmp_dir = ".tmp_examples/"
outputs = "outputs.txt"

def run(config):
    config.verbosity = 3
    config.defines = "enc_RF=0,enc_RBF1=0,enc_RBF2=0"
    config.debug = True
    
    analyze_program(config)
    
def run_fresh(example, skip_solving, expand, alloy):
    config = Config()
    config.inputfile = example+".bex"
    
    config.prefix = tmp_dir+example+"/"
    config.sat = True
    if os.path.exists(config.prefix):
        shutil.rmtree(config.prefix)
            
    config.skip_solving = skip_solving
    config.expand_bounded_sets = expand

    if alloy:
        config.use_alloy = True
    
    #solving one instance
    run(config)

    # generating the expected outputs
    config.skip_solving = True
    config.sat = False
    run(config)
    
    # checking if the new model is correct
    with open(config.prefix+outputs, "r") as new:
        with open(example+"/"+outputs, "r") as old:
            linesold = [x.strip() for x in old.readlines()]
            assert(len(new.readlines()) != 0)
            for linenew in new.readlines():
                assert(linenew in linesold)
                
    shutil.rmtree(tmp_dir)    

def run_existing(example, skip_solving, print_all):
    config = Config()
    config.inputfile = example+".bex"
    
    config.prefix = example+"/"
    config.sat = False
    config.nexecs = 20
    config.skip_solving = skip_solving
    config.expand_bounded_sets = True
    if print_all:
        config.printing_relations = None

    run(config)

    
def test_generation():
    for example in examples:
        yield run_existing, example, True, True

    for example in examples:
        yield run_existing, example, True, False

    for example in ex_fast:
        yield run_existing, example, False, False
        
def test_verification():
    for example in ex_fast:
        yield run_fresh, example, False, True, False

    for example in ex_fast:
        yield run_fresh, example, False, False, False

    for example in ex_fast:
        yield run_fresh, example, False, True, True

if __name__ == "__main__":
    for example in ex_fast:
        run_existing(example, True, True)
        
    for example in ex_fast:
        run_fresh(example, False, True, False)

    for example in ex_fast:
        run_fresh(example, False, False, False)

    for example in ex_fast:
        run_fresh(example, False, True, True)
        
