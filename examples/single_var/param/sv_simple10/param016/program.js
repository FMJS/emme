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
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.5000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2.toFixed(4));
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
outputs[0] = "id4_R_t2: 0.0000";
outputs[1] = "id4_R_t2: 0.1250";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrT188vLSkoLdHXV8hMMYkPii8xslIw0DMAAn393PyU1BygjIeTgq1CtUZmilF8eHyJoQ5QqTGYpamj
//ABQ1BLJzEzPzQOJGOMRxqYdYqVmr4OjnouDrT2t7wOII05FFjdFFIW4KcnIDO0oDJg5SATMZqNMApBuX
//pCE+SSN8ksb4JE3wSZrikzTDJ2kO87IbNBqwqIKoCA6HqsAWlVz6o2lqUKYpmiUbdEl4QBoTkaLAAYWh
//FzmdjaaoIVlKYSYauLdNcEuZ4pYyJz01GZOQmgyNTEdTE+7UBLfdAHd+N8QtZYSvlKByQjEjKw0hBy95
//KWi0PBrg8siMjonMnOy6jYgUBgBqOFZ6
