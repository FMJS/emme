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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      if(id3_R_t2 >= 0) {
         var x = new Int8Array(data.x_sab); x[0] = 2;
      } else {
         var x = new Int8Array(data.x_sab); x[1] = 2;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id3_R_t2: 0;id6_R_t3: 0";
outputs[1] = "id3_R_t2: 1;id6_R_t3: 0";
outputs[2] = "id3_R_t2: 0;id6_R_t3: 1";
outputs[3] = "id3_R_t2: 1;id6_R_t3: 1";
outputs[4] = "id3_R_t2: 0;id6_R_t3: 2";
outputs[5] = "id3_R_t2: 1;id6_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrT188vLSkoLdHXV8hMMY4Pii8xslIwsM5MMQOxjYFsff3c/JTUHKACDycFW4VqjcwUw/jw+NzEzDwd
//oB4jILvEUFNHAU0cYhamOMRciDhEDUjUBGQKFtVQ8VoFRz8XBV9/KtsP0YuuGiGK3a1k+QDNZGRRCBvJ
//ZIhvg5zcwN5FsQVmMlCnAUi3BkwTKZKGMBvcoOGJ1XzsuiE6g8NBOiFssH+T8/NSbEOCQl01ufSxpSjD
//0RQ1SFMU3Lc0SU/IYUm91IRcPhmOpqYhWD4ZYkgipUPySyc0caiZVCizRlPZ0CuzyEtjBEosqqYw5HLM
//aDSFDYtyDG4jFcsxlNihqBwbTWXDoRwjJo2RVo4Rm8IA3UUrYA==
