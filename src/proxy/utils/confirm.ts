import inquirer from "inquirer";

const questions = {
  type: "input",
  name: "name",
  message: "你想说点什么?",
};

export const userConfirm = (message: string): Promise<string> =>
  inquirer
    .prompt([{
      ...questions,
      message,
    }])
    .then((answers: { name: string }) => answers.name);
