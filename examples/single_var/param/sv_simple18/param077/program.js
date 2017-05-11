// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 3;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwhsdHYNtPTQUEIvbSE95CgFcxCapgdzKvnv1fiB0bH1YzdaeG9hnI1mDQ/D
//q1LuD9HXIZJShIHnr/3IvRXzuzBY5J+l3O2D7Ufc8LQU9+L7Ogxcf+NHzixeQadPNzNxVlVsVZeqxPYS
//26vYanqtSTW90rTqxB279/Azqbul7nKdGuqqoa4b6l7DebPrOYqHl0fx/Io9a79nlV/vsdVyL7G9xPYq
//tlexvZrt1dXe9B6vl6vTTT7b4fzXxSvnyeqmg052cMEddH87SPnpV9lfjP1+fnW68m2TrDxeSQ4BAgJA
//AAiYQsCpIVBs89w+AcxZe8OA6QAwAAaL00Gxnc4lYaDBMGBiAAyAYRgMtaHgUiy47A0no9OCAxSAAlAY
//J0ug2sFiw90BSUKlnn1nx2kBMAAGwDBKvmCChdbpQm8sMEUAC2AxeuZgFguyhAUmC2ABLEbOIfpR0SuF
//MDJVILAEFIBiMu85FBtL5rIJ3WuCAAyAATBM5N2H7iz0zSY0pghgASz+8/sQQ7AgS1hgsgAWwGJy70i0
//ocJENqHxxANQAIrJZxOlrNJkMqFYLDSebAAFoDDxXMIoCX+lEkOhwPQAKADFOJmEJSjIChSYKAAFoBgj
//jxjIRJc0oj0SP8aOW5A=
