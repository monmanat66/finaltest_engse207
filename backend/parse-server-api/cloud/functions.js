Parse.Cloud.define("hello", (req) => {
  req.log.info(req);
  return "Hi from Parse Server";
});

Parse.Cloud.define("OnlineAgentByAgentCode", async (request) => {   //อ่าน status 
  let AgentCode = request.params.AgentCode;

  let returnCode = 0;
  //------------------

  const query = new Parse.Query("OnlineAgentLists"); // select * from OnlineAgentLists

  query.equalTo("AgentCode", AgentCode); // where AgentCode = 'AgentCode'

  //console.log("Agent Name: "+request.params.AgentCode);

  let results;

  try {                                   //คำสั่งที่กำหนดการทำงานของ function
    results = await query.first();        //เอา query มา record เดี่ยวมาที่ตัวแปร resault

    if (results == undefined) {           //ถ้าไม่มีค่าใน Databaseจะเท่ากับ 9 ถ้ามีค่าก็จะ ขึ้น 1-4 ตามสถานะของ AgentStatus
      returnCode = "9";
    } else {
      returnCode = results.get("AgentStatus");   //return ตามสถานะ
    }

    return returnCode;
  } catch (error) {
    throw error.message;
  }
});

Parse.Cloud.define("postOnlineAgentListByTeam", async (request) => {   //Insert Delete Update
  /*
    Parameter:
            AgentCode: AgentCode,
            AgentName: AgentName,
            Queue: Queue,
            AgentStatus: AgentStatus,
            AgentStatusCode: AgentStatusCode,
            IsLogin: IsLogin
    */
  let AgentCode = request.params.AgentCode;
  let AgentName = request.params.AgentName;
  let Queue = request.params.Queue;
  let AgentStatus = request.params.AgentStatus;
  let AgentStatusCode = request.params.AgentStatusCode;
  let IsLogin = request.params.IsLogin;
  let startedAt = new Date();

  let QueueInt = 0;

  if (Queue != undefined) QueueInt = parseInt(Queue); //long

  let Teams = [
    "Team0",
    "Team1",
    "Team2",
    "Team3",
    "Team4",
    "Team5",
    "Team6",
    "Team7",
    "Team8",
    "Team9",
  ];
  let QueueText = Teams[QueueInt];

  let returnCode = 0;
  //------------------
  console.log("AgentCode: " + AgentCode);
  console.log("AgentName: " + AgentName);
  console.log("QueueText: " + QueueText);
  console.log("AgentStatus: " + AgentStatus);
  console.log("AgentStatusCode: " + AgentStatusCode);
  console.log("IsLogin: " + IsLogin);

  if (IsLogin != undefined) IsLogin = parseInt(IsLogin); //long

  if (IsLogin == 0) {
    const agent_query = new Parse.Query("OnlineAgentLists");
    agent_query.equalTo("AgentCode", AgentCode); // where AgentCode = '1234'

    agent_query.find().then(   //สั่งให้เชื่อมต่อจากตารางนี้
      function (agents) {   //ผลลัพท์จาก find จะถูกมาเก็บที่ agents
        //What do I do HERE to delete the posts?
        agents.forEach(function (agent) {   //ส่งข้อมูลที่ละ object (.forEach)
          agent.destroy({                   //ลบข้อมูลใน method นั้นโดยทันที
            success: function () {
              // SUCCESS CODE HERE, IF YOU WANT
              console.log("Delete success: " + AgentCode);
            },
            error: function () {
              // ERROR CODE HERE, IF YOU WANT
              console.log("Delete error: " + AgentCode);
            },
          });
        });
      },
      function (error) {
        response.error(error);
      }
    );

    return returnCode;
  } else {
    // IsLogin == 1

    const query = new Parse.Query("OnlineAgentLists");  //เช็ค
    query.equalTo("AgentCode", AgentCode);

    let results;

    try {
      results = await query.first();   

      if (results == undefined) {
        // Record not found
        // Insert Data

        let onlineagentlist = new Parse.Object("OnlineAgentLists");

        if (AgentCode != undefined) onlineagentlist.set("AgentCode", AgentCode);
        else returnCode = 11;
        if (AgentName != undefined) onlineagentlist.set("AgentName", AgentName);
        else returnCode = 12;
        if (Queue != undefined) onlineagentlist.set("Queue", QueueText);
        else returnCode = 13;
        if (AgentStatus != undefined)
          onlineagentlist.set("AgentStatus", AgentStatus);
        else returnCode = 14;
        if (AgentStatusCode != undefined)
          onlineagentlist.set("AgentStatusCode", AgentStatusCode);
        else returnCode = 15;
        if (IsLogin != undefined) onlineagentlist.set("IsLogin", IsLogin);
        else returnCode = 16;
        if (startedAt != undefined) onlineagentlist.set("startedAt", startedAt);
        else returnCode = 17;

        if (returnCode == 0) onlineagentlist.save(); //Insert data(พอได้แล้ว save)
      } else {
        //  Found record
        // Update Data

        if (AgentName != undefined) results.set("AgentName", AgentName);
        else returnCode = 1;
        if (Queue != undefined) results.set("Queue", QueueText);
        else returnCode = 2;
        if (AgentStatus != undefined) results.set("AgentStatus", AgentStatus);
        else returnCode = 3;
        if (AgentStatusCode != undefined)
          results.set("AgentStatusCode", AgentStatusCode);
        else returnCode = 4;
        if (IsLogin != undefined) results.set("IsLogin", IsLogin);
        else returnCode = 5;
        if (startedAt != undefined) results.set("startedAt", startedAt);
        else returnCode = 6;

        //if (returnCode == 0) results.save();
        if (returnCode == 0) {
          results.save();
          returnCode = 9;
        }
      }

      return returnCode;
    } catch (error) {
      throw error.message;
    }
  }
});


Parse.Cloud.define("postWallBoardBanner", async (request) => {
  let { BannerText, Queue, IsDelete } = request.params;
  let returnCode = 0;

  // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
  if (!BannerText || Queue === undefined) {
    returnCode = 1; // รหัสผิดพลาดถ้าข้อมูลไม่ครบ
    return returnCode;
  }

  try {
    // ตรวจสอบการลบข้อมูล (IsDelete == 1) 
    if (IsDelete === 1) {
      const query = new Parse.Query("WallboardBanners");
      query.equalTo("Queue", Queue);
      
      const result = await query.first();
      
      if (result) {
        await result.destroy();
        console.log(`Banner with Queue ${Queue} deleted successfully.`);
      } else {
        console.log(`No banner found with Queue ${Queue}.`);
      }

      return returnCode; // ลบข้อมูลเสร็จแล้ว

    } else {
      // ค้นหาบันทึกเดิมในกรณีที่ต้องการอัปเดต
      const query = new Parse.Query("WallboardBanners");
      query.equalTo("Queue", Queue);

      let result = await query.first();
      if (result) {
        // ถ้ามีข้อมูลแล้ว (Update)
        result.set("BannerText", BannerText);
        await result.save();
        console.log(`Banner with Queue ${Queue} updated successfully.`);
        returnCode = 9; // อัปเดตสำเร็จ
      } else {
        // ถ้าไม่พบข้อมูล (Insert)
        const newBanner = new Parse.Object("WallboardBanners");
        newBanner.set("Queue", Queue);
        newBanner.set("BannerText", BannerText);
        await newBanner.save();
        console.log(`Banner with Queue ${Queue} inserted successfully.`);
        returnCode = 0; // บันทึกสำเร็จ
      }
    }

    return returnCode;
  } catch (error) {
    console.error("Error:", error);
    return error.message;
  }
});
