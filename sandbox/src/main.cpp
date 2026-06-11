#include <exception>
#include <iostream>
#include <string>

#include "evaluator.h"
#include "parser.h"

int main() {
    std::string line;
    std::cout << "calc REPL — type 'exit' or Ctrl-D to quit\n";
    while (true) {
        std::cout << "> " << std::flush;
        if (!std::getline(std::cin, line)) {
            std::cout << '\n';
            break;
        }
        if (line == "exit" || line == "quit") {
            break;
        }
        if (line.empty()) {
            continue;
        }
        try {
            auto ast = calc::parse(line);
            std::cout << calc::evaluate(*ast) << '\n';
        } catch (const std::exception& ex) {
            std::cout << "error: " << ex.what() << '\n';
        }
    }
    return 0;
}
