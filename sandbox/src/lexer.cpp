#include "lexer.h"

#include <cctype>
#include <stdexcept>
#include <string>

namespace calc {

Lexer::Lexer(std::string_view source) : source_(source) {}

void Lexer::skip_whitespace() {
    while (pos_ < source_.size() &&
           std::isspace(static_cast<unsigned char>(source_[pos_]))) {
        ++pos_;
    }
}

Token Lexer::next() {
    skip_whitespace();

    if (pos_ >= source_.size()) {
        return Token{TokenType::END, 0, pos_};
    }

    const std::size_t start = pos_;
    const char c = source_[pos_];

    if (std::isdigit(static_cast<unsigned char>(c))) {
        std::int64_t value = 0;
        while (pos_ < source_.size() &&
               std::isdigit(static_cast<unsigned char>(source_[pos_]))) {
            value = value * 10 + (source_[pos_] - '0');
            ++pos_;
        }
        return Token{TokenType::NUMBER, value, start};
    }

    ++pos_;
    switch (c) {
        case '+':
            return Token{TokenType::PLUS, 0, start};
        case '-':
            return Token{TokenType::MINUS, 0, start};
        case '*':
            return Token{TokenType::STAR, 0, start};
        case '/':
            return Token{TokenType::SLASH, 0, start};
        default:
            throw std::runtime_error("unexpected character '" +
                                     std::string(1, c) + "' at position " +
                                     std::to_string(start));
    }
}

const char* token_type_name(TokenType type) {
    switch (type) {
        case TokenType::NUMBER:
            return "NUMBER";
        case TokenType::PLUS:
            return "PLUS";
        case TokenType::MINUS:
            return "MINUS";
        case TokenType::STAR:
            return "STAR";
        case TokenType::SLASH:
            return "SLASH";
        case TokenType::END:
            return "END";
    }
    return "?";
}

}  // namespace calc
