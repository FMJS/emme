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
      var x = new Int8Array(data.x_sab); x[2] = 2;
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
outputs[2] = "id6_R_t2: 0;id7_R_t2: 2";
outputs[3] = "id6_R_t2: 2;id7_R_t2: 2";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 768";
outputs[5] = "id6_R_t2: 2;id7_R_t2: 768";
outputs[6] = "id6_R_t2: 0;id7_R_t2: 770";
outputs[7] = "id6_R_t2: 2;id7_R_t2: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2stKw0AUBuC9TzFLhcI0c3IRxYVFihsV6qLLIMRFwFoX6Ur67ibNhTQ50WQyuQj/rpycadJJ+Tj8
//jJT7Q/R1iKQUYeD6Gz9SN2J5GwZe/lnK3T54/4gbHlfiTnxfhoHyt35kLeIVdPp0tRBnVZutOqUqsb3E
//9tpsNX3WpJo+aVq14o7dW/iZ1FWpu1ynhrrdUHca6m7DfbPnOYr75wfx9II9a79nlV/vstVyL7G9xPba
//bK/N9jpsr1PtTd/xZrU+veSzHc5/XbxymaxuumhlFz3uovrtIuW3X2d/Mfb7+dXpytdtsvJ4ITkEFBAA
//AkDAFAJWDYFim5fDE8DcVRsGTAeAATAMOB0U22mNCQP1hgETA2AADP1gqA0FY7Gg2BdORqcFBRSAAlCY
//Jkug2sViw1WPJKFSz76z47QAGAADYJgkXzDBQut0QRsLTBHAAlhMnjmYxYIGwgKTBbAAFhPnEHpUaKUQ
//RqYKz70GFaACVMzlpEOxsWQunXC0ZgjQABpAw2zOP3SHQTefcDBJgAtw8b9PRfThggbiAtMFuAAXMzwr
//0QYLExmF5mTh4VgVqAAVY2YUpdTSZEJhs1xoThBgASyAhRHzCaMo/JVO9KUCEwSoABVTZRMDUUGDUIGp
//AlSAimlyiZ5QdEkl2jPxAw+mXxQ=
