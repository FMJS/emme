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
outputs[1] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 1";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rg0AQBuB7f8UeWwhs1nENtPTQUEIvbSE95CgFcxCapgdzKvnv1fiB0bHVdY0W3lsYZ6NZw8Pw
//qpT7Q/R1iKQUYeD5az9ybsX8LgwW+Wcpd/tg+xE3PC3Fvfi+DgPH3/iRmsUr6PTpZibOqi5b1aUqsb3E
//9rpsNb3WpJpeaVpVccfuPfxM6k6pu1ynhrrbUNcNda/hvNn1HMXDy6N4fsWetd+zyq/32Gq5l9heYntd
//ttdlezXbq6u96T1eL1enm3y2w/mvi1fOk9VNB1V2cMEddH47SPnpV9lfjP1+fnW68m2TrDxeSQ4BBQSA
//ABCwhYCqIVBs83x4ApizGsOA6QAwAIYBp4NiO9UlYaDeMGBiAAyAoR8MtaHgUiw47A0nq9OCAgpAASiM
//kyVQ7WCx4U6PJKFSz76z47QAGAADYBglX7DBQut0wRgLTBHAAliMnjnYxYIGwgKTBbAAFiPnEGZUGKUQ
//VqYKBJaAAlBM5j2HYmPJXjahjSYIwAAYAMNE3n3ozoJpNqExRQALYPGf34fogwUNhAUmC2ABLCb3jkQb
//KmxkExpPPAAFoJh8NlHKKm0mEy6LhcaTDaAAFCaeS1gl4a9Uoi8UmB4ABaAYJ5MYCAoaBApMFIACUIyR
//R/Rkoksa0R6JH7VQW4A=
