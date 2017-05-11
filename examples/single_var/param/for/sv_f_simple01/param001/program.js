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
      for(i = 0; i <= 1; i++){
         var x = new Float32Array(data.x_sab); x[i] = i+0.0;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2.toFixed(4));
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
outputs[0] = "id3_R_t2: 0.0000";
outputs[1] = "id3_R_t2: 0.0078";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlb0OgjAQgHefoiMkxLYg1Jg4SAxxURMcGBsTHEhEHGAyvruVH1O1XBDjb2CC++7o0X45ME6ydJ+l
//GKMotLjPU3OESJ+IC+M4CTdbQWYuGqODFoUmD3hKOTHQ5Z7qBhKEiqd4He0kQmqJoqZYWj+iyWKK5st3
//rZfH5VUUcXrXn+96eYNaFT9nVG8XtXkndZBC0ISgBcEBBG0IOhBk1Sd75ZEosoqMVVBmqI61hzvPfsaz
//l6l0C6UNtRp4lm+Wolr2rzPtbyaaU+cLVToqQRuCrLVptKlpbNiZ9pBpUhcEmhIUgiY8X14ik9PStOtt
//b29aN9O+bqY5H9CQPfH3bGTgCdlIfm0=
