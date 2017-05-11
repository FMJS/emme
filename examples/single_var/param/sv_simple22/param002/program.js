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
      var x = new Int16Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 0);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 0);
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 0;id5_R_t2: 1";
outputs[2] = "id2_R_t1: 0;id5_R_t2: 256";
outputs[3] = "id2_R_t1: 0;id5_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k1rgzAYB/D7PkWOGwgxNjWwscPKKLtsg+7QowzcQVjXHexp9LtPF19SjfiWKI7/TR6Txxjlh/yR
//0uMp/j7FlJIo9IJdELNb4t5F4To99pJjSg/H8OMzGfC0Iffk5zof5yQzVsE+ObpxyEWVK1U5olqV3dOq
//n1a9alUoVTmiWmXJ8eE9+nKKddfr6urUOm+oy+vX637DdbP1nMnDyyN5fsXu6Hancvdql7Lqa8eqHcqd
//UjuUVV87Vu3AtR24tgOvdpDPeLfZ/j3ki1Xm95zMdNPZTSdZdrJ8jpqZ2pMsv/y29oopo/Sz5cy3fTaz
//y4uRbc/5igIH4AAcDOHAajgUTV37NOi3sx8YgAEwAIYJvhqKBbApYRCAATAAhplhqH0UTMVC+6bZQoEB
//BaAAFGxnDPWTxeNxRyQMlXrWsz13AAyAATDMny+YYKFzutCOBVgAC2Bh/nTBLAsCLIAFsLD0bGEYCoOS
//BSMkeGsfKAAFoDD9/wvFY2DmsgVuMFsADaABNMzw90J/GIamCxzfDIABMCzl74UxMAjAABgAw3/8e6EL
//CyYShqEoCKAAFICClYRBSRdN5gsr7atkNl0AC2ABLNhIF4yi0JYtdKYCKAAFoDBbsmAJBQEUgAJQWGSq
//MJKEPplCdxB+ARWBMEA=
