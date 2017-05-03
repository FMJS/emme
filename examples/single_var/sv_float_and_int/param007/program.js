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
      for(i = 0; i <= 3; i++){
         var x = new Int8Array(data.x_sab); x[3] = 60.0+i;
      }
      var x = new Int32Array(data.x_sab); id3_R_t1 = x[0]; report.push("id3_R_t1: "+id3_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float32Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t1: 1056964608;id4_R_t2: 0.0000";
outputs[1] = "id3_R_t1: 1056964608;id4_R_t2: 0.0078";
outputs[2] = "id3_R_t1: 1056964608;id4_R_t2: 0.0313";
outputs[3] = "id3_R_t1: 1056964608;id4_R_t2: 0.1250";
outputs[4] = "id3_R_t1: 1056964608;id4_R_t2: 0.5000";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmEFrwkAQhe/9FXusIN2dGZNapQelSC9twR48hkJ6CFTtIZ7E/+7WjZJkdwIiDXuYnMJ7mdnJvuSD
//ROvtrvzdlVqrIqdsmZUwUWCS9CkdpWY8LfLRn4gTZR6MPbReb/PvH3v561w9q/19kWO2slWZGarLOQyG
//Kuwg65DvuHkaOrC9gO0FTC9kK5CpoLYOVl9/FZtaJ8M6fA2yDvkOt74LanBQs/cX9fYh6cSYjreLAR0Y
//HRmd2rqbwXsmlvPF6aFoXHGe0Vae9oYzoctEz6xtEFWmm4VZM2hCl4ldJp1veVG9BsGxuYnDXV3Hz1XV
//MfTq3emrcPo4FpwKTiUdwWmMOK1F/B84bemX1eqYvRKoBCRAFaBKOgLUiIEKvQIVbgAqYCIf/AJUSUeA
//GjNQsVeg4g1ATeQPqgBV0hGgxg1U6hWo1ATqEbZHtDE=
