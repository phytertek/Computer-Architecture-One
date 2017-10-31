let program;
const register = Array(4);
let registerPointer;
let programCounter = 0;
const commands = {
  1: () => {
    //INITIALIZE
    programCounter++;
  },
  10: () => {
    // SET REGISTER
    registerPointer = parseInt(program[programCounter + 1], 2);
    programCounter += 2;
  },
  110: () => {
    // PRINT_NUMERIC
    process.stdout.write(String(register[registerPointer]));
    programCounter++;
  },
  101: () => {
    // MUL INTO LAST
    register[registerPointer] =
      register[parseInt(program[programCounter + 1])] *
      register[parseInt(program[programCounter + 2])];
    programCounter += 3;
  },
  100: () => {
    // SAVE NEXT
    if (
      String.fromCharCode(parseInt(program[programCounter + 1], 2)).match(
        /[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstzuvwxyz\-\_\.& ,\+!@#$%\^*();\\/|<>"'?=:]+/g
      )
    ) {
      register[registerPointer] = String.fromCharCode(
        parseInt(program[programCounter + 1], 2)
      );
    } else {
      register[registerPointer] = parseInt(program[programCounter + 1], 2);
    }
    programCounter += 2;
  },
  111: () => {
    // PRINT_ALPHA
    process.stdout.write(String(register[registerPointer]));
    programCounter++;
  }
};
process.stdin.setEncoding('utf8');
process.stdin.on('readable', () => {
  const file = process.stdin.read();
  if (file) {
    program = file
      .split('\n')
      .map(line =>
        line.slice(0, line.indexOf('#') - 1).slice(line.indexOf('1'))
      )
      .slice(1);
  }
  const executeCore = () => {
    if (commands[program[programCounter]]) {
      return commands[program[programCounter]]();
    }
  };
  const runProgram = setInterval(() => {
    if (programCounter < program.length) {
      executeCore();
    } else clearInterval(runProgram);
  }, 50);
});
