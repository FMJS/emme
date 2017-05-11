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
      var x = new Int8Array(data.x_sab); x[1] = 3;
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
outputs[1] = "id6_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 768;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 770;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 3";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 3";
outputs[6] = "id6_R_t2: 768;id7_R_t2: 3";
outputs[7] = "id6_R_t2: 770;id7_R_t2: 3";
outputs[8] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[9] = "id6_R_t2: 2;id7_R_t2: 768";
outputs[10] = "id6_R_t2: 768;id7_R_t2: 768";
outputs[11] = "id6_R_t2: 770;id7_R_t2: 768";
outputs[12] = "id6_R_t2: 0;id7_R_t2: 771";
outputs[13] = "id6_R_t2: 2;id7_R_t2: 771";
outputs[14] = "id6_R_t2: 768;id7_R_t2: 771";
outputs[15] = "id6_R_t2: 770;id7_R_t2: 771";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1LwzAYB/C7nyJHhUHWpGlE8eCQ4UWFefBYhHooOOehO8m+u+3alax7ql2Svhz+t/HkSV/S8aP9
//E8432+x7m3HO0iSKV3Embtj8Nk304Tfn603y8Zk3PC7YHfu5TBMRv8VZMMtnyP2vqxk7qoZkVRlVSfZK
//sjckq+W1FtXySstqkHes39Ovoi6MbrMuW+phS1211KOW81bXs2P3zw/s6QVr1n3NGncfkVWzV5K9kuwN
//yd6Q7FVkr2r2ls94tVjuH/LRCh/uLp85L2a3DQbVoKYGxV+D8nD6ZfUXI49Pzy5nvr4VM3cXnEJAAAEg
//AAR8IRCcIFAv87x/AoizWsOgo2vQABpAQ3/vB/VyBkPSIN1p0Ph0AA2gwY2GkxeDoWAQ5AN3Z8FEQQIF
//oAAUxskT5MlgveDCIU1o1KtjnpkxAAbAABhGyRh8sNA5YbDG4jh3ABfgAlyMkjv45UL2xYXGZwe4ABcj
//ZxF2WFglEdZUmFDkbxmgAlSAiqnseKgXVvpLKJRVQgEaQANomMw+iPNhsM0olGVGATAABsCYzO4IFzBk
//X2BofHwADIAxwT0TXbjwkVMou5xCB6ACVICKAXMKI7n0mVKEJBeWGQVYAAtgYcCMwisK/yUUrlQ08glg
//ASyAxYD5RE9YyH6w0PjgABbAYpxswpGKc5KJ7lD8AhunYqA=
