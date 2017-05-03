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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 3;
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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 513;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[7] = "id6_R_t2: 513;id7_R_t2: 768";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUGWvE0nigeHDC8qzMOORegOBec8dCfZd7ddu9Jtb7VL0y2D51bevOmftPwo
//D5FyuUq/V6mUIonDaBql+k4M75N4tD2WcrGM559Zw/NYPIif6yTW0SxK1SCbQZujm4HYqQZs1dSqxPYS
//2xuw1eJe82pxp0VVZR2Lj+Qrr+tad71ODfWgoW4a6mHDdcv7WYvH1yfx8oY1a79me08fstV6L7G9xPYG
//bG/A9hq21+z3Fu94Op5sXvLOCm+fLps5zGc3DapycMQN6r8GaXv5SfmJsefnZxcz32f5zPWV5BBQQAAI
//AAFXCKgDBKplHvZPAHNVaxiM0qABNICG/v4PquVUp6SBHNBAoAE0gIZONBz8GJwKBs2+8O4sIE8ACkDB
//gzyBDgarBdcd0oS9enlOZAyAATBcQsbggoXWCYM1FsgdwAW48CB3cMsF9cYFsghwAS7OnEXYYWGVRFhT
//Uc8nRuEtqAAVoMKXHQ/VwpK7hMJYJRSgATSABm/2QRwPg21GYSwzCoABMACGN7sjuoBBvYFBAANgAAz/
//9ky04cJFTmGQU4AKUHEBOUUtuXSZUgQsF8gowAJY8D+jcIrCfwlFVyqQTwALYHG+fKInLKgnLJBNAAtg
//cZ5soiMVxyQT7aH4BXHCYmA=
