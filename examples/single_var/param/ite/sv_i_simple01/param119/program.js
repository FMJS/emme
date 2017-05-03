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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      if(id3_R_t2 <= 1) {
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
outputs[0] = "id3_R_t2: 2;id6_R_t3: 0";
outputs[1] = "id3_R_t2: 2;id6_R_t3: 2";
outputs[2] = "id3_R_t2: 2;id6_R_t3: 512";
outputs[3] = "id3_R_t2: 2;id6_R_t3: 514";
outputs[4] = "id3_R_t2: 0;id6_R_t3: 0";
outputs[5] = "id3_R_t2: 0;id6_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlk2PgjAQhu/+ih4lMSmt1YPGg2aX7MGPBNd4JGbxQKLiAU9m/7stFehSsIBNNmhvzdu+05npExgI
//w0t0vkQQgsDve64X4RHA48AfsnV/BGwIj6G/P9ADXzMwAdducq5HHQNvS1dWD1AV0fVxF5yYjpmOZJ07
//Zb0sDs/C+gXT5QdYrP7r/ljnMfNRMlWMkalihCxvUeU+qVp35sTl/vGlddnM200sbCtJW7WJkviO1E2x
//awVe7ltvmY+v4279hCd/4kzn60+rA1U4YYNT63BC0qbgawpTTr+f1oHYABnIXuGbleaGdEF2j6gHMmIg
//awdkD7aaI1asPgmYrZi7nnnI4naTkuclYiEpXrruVwGjRqNyBbnIokpq4FV1uGo6eZV9sSrNXt/upgpR
//2BDVQqKaDV9KnuqPX4ayt6IsvVEjZUT9e4wpuwFkt92r
