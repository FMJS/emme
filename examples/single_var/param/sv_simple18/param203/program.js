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
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 3;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 3";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 515";
outputs[7] = "id6_R_t2: 2;id7_R_t2: 515";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2sFqg0AQBuB7n2KPLQRWd9wEWnpoKKGXtpAecpSCOQhN04M5lbx7NRoxydjquroW/luYnY1mDR/D
//j1Jud8nXLpFSxNE0XIaJuhXeXRzNjp+l3Gyj9Ufa8DQX9+L7Oo5UuAoTf5LuoMOnm4k4qQZsVVeqxPYS
//2xuw1fxes2p+p3nVTzs27/FnVleV7mqdaupBTV3X1Kc11y3uZy8eXh7F8yvOrPmZnf36KVut9hLbS2xv
//wPYGbK9me/V5b/6Ml/PF4SGfnPDx16U7vWx33aJfLM64RfXbIh0vvyj+Yuz387vznW+rbOf+SnIIKCAA
//BICALQT8CwTKY/b6J4C5qjEMmA4AA2DocTooj9MfEgbqDAMmBsAAGLrBcDEUDMWCYh84WZ0WCCgABaDg
//Jkugi8XywFWHJOGsXnxny2kBMAAGwOAkX7DBQuN0wRgLTBHAAlg4zxzsYkE9YYHJAlgAC8c5hBkVRimE
//lalC+wpUgApQMZY3HcqDJXvphDaaIUADaAANo3n/oT0MpvmExiQBLsDF/34rogsX1BMXmC7ABbgY4bsS
//TbCwkVGYThYaVIAKUDFgRlFJLW0mFAHLhekEARbAAlgYLp+wisJf6URXKjBBgApQ4Sqb6IkK6oUKTBWg
//AlS4ySU6QtEmlWjOxA/NPl7Y
