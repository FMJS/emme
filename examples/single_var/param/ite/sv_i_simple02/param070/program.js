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
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 >= 1) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
      }
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
outputs[0] = "id6_R_t2: 0;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 0;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 1;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 1;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtls9rgzAUx+/7K3JsoZDGJGZs9NCyyQ77AXalRxm1B2GtO9jT2P8+Ndql8oJWW3TwbuHr98WX9/Lh
//hdL4kHwdEkpJFLqBHyTOHZneR+FtuaZ0F4fbz9TwtCAz8j2KQidYBwmbpBE8X40n5EQVoCoNlYNeDnoF
//qOpcM1VnqlWWOnYf0T7THcNt6tyiC4suLbpr+W+Rzw+Zvz6QlzesWfOaVU7vgqrp5aCXg14BegXolaBX
//Vr26x/7Cy5t8UuHydGnkNIselUGVj6zcxCsuCrgFHK0jl+ssUq/zsm7ifTjz5s/Lx/ENreObId/IN/J9
//Wb6P5WxBdxGLbCPbyPYA2ZYd2Jbd2GYp22rg7/K+buRf8ZXlnqrBst1XzZwaAt1aAmHWGveikoUCs1Bg
//FgrMQtWyfaxvSbaCsbeybTZInfcmf/dXiDaijWhfB23RFW1xdbQZoo1oI9qXnNrGpzNntlP/GkesEWvE
//uo+J3QRrgVgj1oj1f5rWovW0Fog1Yo1YD3Nai9bTuinWv0vOLps=
