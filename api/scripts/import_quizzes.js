const prisma = require("../dist/generated/prisma").prisma;
const fs = require("fs");
const quiz_file = process.argv[2];

const quiz_data = JSON.parse(fs.readFileSync(quiz_file)).RECORDS;
quiz_data.forEach(
  async ({ questionBlock, blockType, instructions, questions }) => {
    const createQuestionBlock = await prisma.createQuestionBlock({
      blockName: blockName,
      blockType: enum(blockType),
	  instructions: instructions
	  async ({ questionText, type, answerChoices }) => {
		quiz_data.questions.forEach(
			const createQuestionLink = await prisma.createQuestionLink({
			  questionText: questionText,
			  type: enum(type),
			  answerChoices.forEach(
			  	const createQuestionChoice await prisma.createQuestionChoice({
				   answerText: answerText,
				   position: position,
				   correct: correct
				});
				);
			});
			);
		};
    });
    console.log(createQuestionBlock.id);
  }
);
