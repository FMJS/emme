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
   `$262.agent.receiveBroadcast(function (x_sab) {
      var report = [];
      var x = new Int8Array(x_sab); x[0] = 1;
      var x = new Int8Array(x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (x_sab) {
      var report = [];
      var x = new Int8Array(x_sab); x[1] = 2;
      var x = new Int8Array(x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (x_sab) {
      var report = [];
      var x = new Int32Array(x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);
var x_sab = new SharedArrayBuffer(8);
$262.agent.broadcast(x_sab);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      thread_report = thread_report.split(",");
      for(i=0; i < thread_report.length; i++){
         if(thread_report[i] == "") continue;
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
outputs[1] = "id6_R_t3: 1;id7_R_t3: 0";
outputs[2] = "id6_R_t3: 256;id7_R_t3: 0";
outputs[3] = "id6_R_t3: 257;id7_R_t3: 0";
outputs[4] = "id6_R_t3: 512;id7_R_t3: 0";
outputs[5] = "id6_R_t3: 513;id7_R_t3: 0";
outputs[6] = "id6_R_t3: 131072;id7_R_t3: 0";
outputs[7] = "id6_R_t3: 131073;id7_R_t3: 0";
outputs[8] = "id6_R_t3: 131328;id7_R_t3: 0";
outputs[9] = "id6_R_t3: 131329;id7_R_t3: 0";
outputs[10] = "id6_R_t3: 131584;id7_R_t3: 0";
outputs[11] = "id6_R_t3: 131585;id7_R_t3: 0";
outputs[12] = "id6_R_t3: 0;id7_R_t3: 1";
outputs[13] = "id6_R_t3: 1;id7_R_t3: 1";
outputs[14] = "id6_R_t3: 256;id7_R_t3: 1";
outputs[15] = "id6_R_t3: 257;id7_R_t3: 1";
outputs[16] = "id6_R_t3: 512;id7_R_t3: 1";
outputs[17] = "id6_R_t3: 513;id7_R_t3: 1";
outputs[18] = "id6_R_t3: 131072;id7_R_t3: 1";
outputs[19] = "id6_R_t3: 131073;id7_R_t3: 1";
outputs[20] = "id6_R_t3: 131328;id7_R_t3: 1";
outputs[21] = "id6_R_t3: 131329;id7_R_t3: 1";
outputs[22] = "id6_R_t3: 131584;id7_R_t3: 1";
outputs[23] = "id6_R_t3: 131585;id7_R_t3: 1";
outputs[24] = "id6_R_t3: 0;id7_R_t3: 256";
outputs[25] = "id6_R_t3: 1;id7_R_t3: 256";
outputs[26] = "id6_R_t3: 256;id7_R_t3: 256";
outputs[27] = "id6_R_t3: 257;id7_R_t3: 256";
outputs[28] = "id6_R_t3: 512;id7_R_t3: 256";
outputs[29] = "id6_R_t3: 513;id7_R_t3: 256";
outputs[30] = "id6_R_t3: 131072;id7_R_t3: 256";
outputs[31] = "id6_R_t3: 131073;id7_R_t3: 256";
outputs[32] = "id6_R_t3: 131328;id7_R_t3: 256";
outputs[33] = "id6_R_t3: 131329;id7_R_t3: 256";
outputs[34] = "id6_R_t3: 131584;id7_R_t3: 256";
outputs[35] = "id6_R_t3: 131585;id7_R_t3: 256";
outputs[36] = "id6_R_t3: 0;id7_R_t3: 257";
outputs[37] = "id6_R_t3: 1;id7_R_t3: 257";
outputs[38] = "id6_R_t3: 256;id7_R_t3: 257";
outputs[39] = "id6_R_t3: 257;id7_R_t3: 257";
outputs[40] = "id6_R_t3: 512;id7_R_t3: 257";
outputs[41] = "id6_R_t3: 513;id7_R_t3: 257";
outputs[42] = "id6_R_t3: 131072;id7_R_t3: 257";
outputs[43] = "id6_R_t3: 131073;id7_R_t3: 257";
outputs[44] = "id6_R_t3: 131328;id7_R_t3: 257";
outputs[45] = "id6_R_t3: 131329;id7_R_t3: 257";
outputs[46] = "id6_R_t3: 131584;id7_R_t3: 257";
outputs[47] = "id6_R_t3: 131585;id7_R_t3: 257";
outputs[48] = "id6_R_t3: 0;id7_R_t3: 512";
outputs[49] = "id6_R_t3: 1;id7_R_t3: 512";
outputs[50] = "id6_R_t3: 256;id7_R_t3: 512";
outputs[51] = "id6_R_t3: 257;id7_R_t3: 512";
outputs[52] = "id6_R_t3: 512;id7_R_t3: 512";
outputs[53] = "id6_R_t3: 513;id7_R_t3: 512";
outputs[54] = "id6_R_t3: 131072;id7_R_t3: 512";
outputs[55] = "id6_R_t3: 131073;id7_R_t3: 512";
outputs[56] = "id6_R_t3: 131328;id7_R_t3: 512";
outputs[57] = "id6_R_t3: 131329;id7_R_t3: 512";
outputs[58] = "id6_R_t3: 131584;id7_R_t3: 512";
outputs[59] = "id6_R_t3: 131585;id7_R_t3: 512";
outputs[60] = "id6_R_t3: 0;id7_R_t3: 513";
outputs[61] = "id6_R_t3: 1;id7_R_t3: 513";
outputs[62] = "id6_R_t3: 256;id7_R_t3: 513";
outputs[63] = "id6_R_t3: 257;id7_R_t3: 513";
outputs[64] = "id6_R_t3: 512;id7_R_t3: 513";
outputs[65] = "id6_R_t3: 513;id7_R_t3: 513";
outputs[66] = "id6_R_t3: 131072;id7_R_t3: 513";
outputs[67] = "id6_R_t3: 131073;id7_R_t3: 513";
outputs[68] = "id6_R_t3: 131328;id7_R_t3: 513";
outputs[69] = "id6_R_t3: 131329;id7_R_t3: 513";
outputs[70] = "id6_R_t3: 131584;id7_R_t3: 513";
outputs[71] = "id6_R_t3: 131585;id7_R_t3: 513";
assert(-1 != outputs.indexOf(report));
