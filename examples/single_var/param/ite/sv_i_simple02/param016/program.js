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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 == 0) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 1;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlktPg0AUhff+ilm2SZOBeTBG00UbJS58JFTTJTHigsQWF3Rl/O8CA3VK7gi0KJjc3eTMuXC5M18O
//lCa79H2XUkriyAuDMGUXxL2Mo/Ny7VC6SaLXt8xwsyRz8jGJIxauw9SdZRW8WE1n5EAVoCoNlYNeDnoF
//qOpec1V3qlU3c2ye422uM8Nt6tyiC4suLbpneW/ZzydZ3F+RuwecWfuZ1b7eA1XTy0EvB70C9ArQK0Gv
//rHv1GQdLvzjkgwnvJ+PktZOqJN+qPjzbcKtH+OU1AR4A1+q61Tqv0+tipC/JNpr7i9vV9fSMItvINrL9
//p2zvh9mZ7LKyD65d5Bq5Rq775FoezbU8jWsn41qNPK+Huo3fo1eWO6pGy/VQM2MN9HmN9MGctT6LWhcK
//7EKBXSiwC9XItfHDXZGt4E0r24YLrv6J78fgCfFGvBHv38Gb1WO7K9zmASHaiDai/S+S2+C+c26z5r9y
//RBvRRrSHSO02YMOZ3R/WLmKNWCPW/Sa2OCGxBaKNaCPa40xscXRit8X6Czf/LpU=
