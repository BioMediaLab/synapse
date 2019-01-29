const prisma = require("../generated/js-prisma-client").prisma;
const fs = require("fs");
const quiz_file = process.argv[2];

const quiz = JSON.parse(fs.readFileSync(quiz_file));

async function main() {
  const block = await prisma.createQuestionBlock({
    blockName: quiz.blockName,
    blockType: quiz.blockType,
    instructions: quiz.instructions,
    course: {
      connect: {
        id: "cjqsfvetc009t0850forqw857",
      },
    },
  });

  quiz.questions.map(async question => {
    const questionLink = await prisma.createQuestionLink({
      block: {
        connect: {
          id: block.id,
        },
      },
    });

    const questionRow = await prisma.createQuestion({
      link: {
        connect: {
          id: questionLink.id,
        },
      },
      questionText: question.questionText,
      type: question.type,
    });

    question.answerChoices.map(async answer => {
      const answerRow = await prisma.createQuestionChoice({
        question: {
          connect: {
            id: questionRow.id,
          },
        },
        answerText: answer.answerText,
        correct: answer.correct === "true" ? true : false,
        position: parseInt(answer.position),
      });

      console.log(answerRow);
    });
  });
}

main();

// quiz.questions.map(question => console.log(question));

/*const quiz_data = JSON.parse(fs.readFileSync(quiz_file)); // .RECORDS ?? breaks it
// console.log("__dirname: " + __dirname);
// console.log ('name:'+ quiz_data.blockName, 'type:' + quiz_data.blockType); // , quiz_data[0]  ('quiz_data:',quiz_data);
json2array(quiz_data);
function json2array(json){
	console.log ('name:'+ json.blockName, 'type:' + json.blockType); // , quiz_data[0]  ('quiz_data:',quiz_data);
    var result = [];
    var keys = Object.keys(json);
	console.log('keys:', keys);
    keys.forEach(function(key){
		if (key != 'questions') {
        result.push(json[key]);
		}
    });
    return result;
	console.log('newArray:', result);
}
*/
