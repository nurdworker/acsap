const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const helmet = require("helmet");
const hpp = require("hpp");
const logger = require("./winston");
const morgan = require("morgan");
const combined =
  ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
const morganFormat = combined; // NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발
const alarm = require("./alarm.js");

app.use(helmet());
require("dotenv").config();

const port = process.env.PORT;

app.use(bodyParser.json());

const version = "1.0.0";
console.log(process.env.NODE_ENV);

const pool = mysql.createPool({
  host:
    process.env.NODE_ENV === "production_acsap"
      ? process.env.host_acsap
      : process.env.host,
  user:
    process.env.NODE_ENV === "production_acsap"
      ? process.env.user_acsap
      : process.env.user,
  password:
    process.env.NODE_ENV === "production_acsap"
      ? process.env.password_acsap
      : process.env.password,
  database:
    process.env.NODE_ENV === "production_acsap"
      ? process.env.database_acsap
      : process.env.database,
  connectionLimit: 15,
});

if (process.env.NODE_ENV === "production_acsap") {
  app.use(morgan("combined"));
  app.use(morgan(morganFormat, { stream: logger.stream })); // morgan 로그 설정
  app.use(hpp());
} else {
  app.use(morgan("dev"));
}

app.post("/api/user", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("에러", ": err");
      res.json({ error: true });
    } else {
      connection.query(
        `select * from user where id = '${id}' and pw = '${pw}'`,
        (error, results, fields) => {
          if (error) {
            alarm.warn(`user / 유저 인증 에러 / ${err.message}`);
            res.json({ error: true });
            connection.release();
          } else {
            if (results[0]) {
              res.json({ correct: true });
              connection.release();
            } else {
              alarm.warn(`user / ${id} 유저 인증 불가 `);
              res.json({ correct: false });
              connection.release();
            }
          }
        }
      );
    }
  });
});

app.post("/api/keyword", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  console.log(id, pw);
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("에러", ": err");
      res.json({ error: true });
    } else {
      connection.query(
        `select * from user where id = '${id}' and pw = '${pw}'`,
        (error, results, fields) => {
          if (error) {
            alarm.warn(`keyword / 유저 인증 에러 / ${err.message}`);
            res.json({ error: true });
            connection.release();
          } else {
            if (results[0]) {
              //키워드데이터 가져오기
              connection.query(
                `select * from keyword where id = '${id}'`,
                (error, results, fields) => {
                  if (error) {
                    alarm.warn(
                      `keyword / 키워드데이터 에러 / ${error.message}`
                    );
                    res.json({ error: true });
                    connection.release();
                  } else {
                    if (results[0]) {
                      console.log(results[0].content);
                      res.json(JSON.parse(results[0].content));
                      connection.release();
                    } else {
                      res.json([]);
                      connection.release();
                    }
                  }
                }
              );
              //키워드데이터 가져오기
            } else {
              alarm.warn(`user / ${id} 유저 인증 불가 `);
              res.json({ error: true });
              connection.release();
            }
          }
        }
      );
    }
  });
});

app.post("/api/insert_keyword", (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const content = JSON.stringify(req.body.content);
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("에러", ": err");
      res.json({ error: true });
    } else {
      connection.query(
        `select * from user where id = '${id}' and pw = '${pw}'`,
        (error, results, fields) => {
          if (error) {
            alarm.warn(`keyword / 유저 인증 에러 / ${err.message}`);
            res.json({ error: true });
            connection.release();
          } else {
            if (results[0]) {
              //키워드데이터 넣기
              const escapedContent = connection.escape(content);
              const sql = `INSERT INTO keyword (id, content) VALUES ('${id}', ${escapedContent}) 
              ON DUPLICATE KEY UPDATE content = ${escapedContent}`;

              connection.query(sql, (error, results, fields) => {
                if (error) {
                  console.error("쿼리 실행 중 오류 발생:", error);
                  return;
                }

                console.log("쿼리 실행 결과:", results);
              });
              //키워드데이터 넣기
            } else {
              alarm.warn(`user / ${id} 유저 인증 불가 `);
              res.json({ error: true });
              connection.release();
            }
          }
        }
      );
    }
  });
});
// app.post("/api/question_data", (req, res) => {
//   // 먼저 유저 체크후, 전체데이터 전송

//   pool.getConnection((err, connection) => {
//     const id = req.body.id;
//     const pw = req.body.pw;
//     const version_fr = req.body.version;
//     alarm.info(`${id} 유저 인증 접속`);

//     if (err) {
//       console.log("에러", ": err");
//       res.json({ error: true });
//     } else {
//       connection.query(
//         `select * from user where id = '${id}' and pw = '${pw}'`,
//         (error, results, fields) => {
//           if (error) {
//             alarm.warn(`question / 유저 인증 에러 / ${err.message}`);

//             res.json({ error: true });
//             connection.release();
//           } else {
//             if (results[0]) {
//               //유저인증완료 ㄱㄱ
//               if (version_fr === version) {
//                 res.json({ correct: true, matched_ver: true });
//                 connection.release();
//               } else {
//                 const query_question = "select * from question";
//                 connection.query(query_question, (error, results, fields) => {
//                   if (error) {
//                     alarm.warn(`question / question_db에러 / ${error.message}`);

//                     res.json({ error: true });
//                     connection.release();
//                   } else {
//                     res.json({ data: results, version });
//                     connection.release();
//                   }
//                 });
//               }
//             } else {
//               alarm.warn(`${id} 유저 비인증 접속`);
//               res.json({ correct: false });
//               connection.release();
//             }
//           }
//         }
//       );
//     }
//   });
// });

// app.post("/api/answer_data", (req, res) => {
//   // 먼저 유저 체크후, 전체데이터 전송
//   console.log("답변 실행됨");

//   pool.getConnection((err, connection) => {
//     const id = req.body.id;
//     const pw = req.body.pw;
//     const version_fr = req.body.version;
//     if (err) {
//       console.log("에러", ": err");
//       res.json({ error: true });
//     } else {
//       connection.query(
//         `select * from user where id = '${id}' and pw = '${pw}'`,
//         (error, results, fields) => {
//           if (error) {
//             alarm.warn(`answer / 유저 인증 에러 / ${err.message}`);
//             res.json({ error: true });
//             connection.release();
//           } else {
//             if (results[0]) {
//               //유저인증완료 ㄱㄱ
//               if (version_fr === version) {
//                 res.json({ correct: true, matched_ver: true });
//                 connection.release();
//               } else {
//                 const query_question = "select * from answer_inner";
//                 connection.query(query_question, (error, results, fields) => {
//                   if (error) {
//                     alarm.warn(`answer / aswer db에러 / ${err.message}`);

//                     res.json({ error: true });
//                     connection.release();
//                   } else {
//                     res.json({ data: results, version });
//                     connection.release();
//                   }
//                 });
//               }
//             } else {
//               alarm.warn(`${id} 유저 비인증 접속`);

//               res.json({ correct: false });
//               connection.release();
//             }
//           }
//         }
//       );
//     }
//   });
// });

app.listen(port, () => {
  if (process.env.NODE_ENV === "production_acsap") {
    alarm.info("start server");
  } else {
    logger.info("start server");
  }
});
