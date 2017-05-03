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
      var x = new Int8Array(data.x_sab); x[2] = 3;
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
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 1;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 513;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 1;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 512;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 513;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[13] = "id6_R_t2: 1;id7_R_t2: 771";
outputs[14] = "id6_R_t2: 512;id7_R_t2: 771";
outputs[15] = "id6_R_t2: 513;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhUI6czKJKC4sUtyoUBcugxAXAWtdpCvpu5s0aZimJ5pOJpfFvwtnzuQyCR/h
//Zzxvs02/t6nniSQOolWUqhsxv03i8HDseetN/PGZNTwuxJ34uUxiFb1FqZxlM2h/dDUTR1WfrWqjSmwv
//sb0+Wy3uNa8Wd1pUZdaxfk++8royus06NdT9hrpuqAcN1y3vZyfunx/E0wvWrP2a1Z4+YKtmL7G9xPb6
//bK/P9mq2V9d7i3e8Wiz3L/lohQ9Pl82c57ObBmU5GHKD6q9BOlx+WX5i7Pn52cXM17d85u7C4xCQQAAI
//AAFXCMgTBKplnvdPAHNVaxi0VKABNICG/v4PquWUQ9JADmgg0AAaQEMnGk5+DIaCQbEvvDsLZp5AQAEo
//AIVx8gQ6GawWXHVIE2r18pxnZgyAATAAhlEyBhcstE4YrLE4zh3ABbgAF6PkDm65oN64IHABLsDFuFmE
//HRZWSYQ1FWY+EQbXoAJUgIqp7HioFpbcJRTaKqEADaABNExmH8T5MNhmFNoyowAYAANgTGZ3RBcwqDcw
//CGAADIAxvT0TbbhwkVNou5wilKACVICKAXMKI7l0mVL4LBeWGQVYAAtgYcCMwikK/yUUXamo5RPAAlgA
//iwHziZ6woJ6wIGABLIDFKNlERyrOSSbaQ/ELhh1iVA==
