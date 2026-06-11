#pragma once

#include <cstdint>
#include <string>
#include <string_view>

namespace calc {

enum class TokenType {
    NUMBER,
    PLUS,
    MINUS,
    STAR,
    SLASH,
    END,
};

struct Token {
    TokenType type{TokenType::END};
    std::int64_t value{0};  // populated when type == NUMBER
    std::size_t pos{0};     // 0-based offset in source, for error messages
};

// Stream-style lexer. Construct over a source string, then call next() to
// advance through the token stream. Returns TokenType::END at end of input
// (and keeps returning it on subsequent calls).
class Lexer {
   public:
    explicit Lexer(std::string_view source);

    Token next();

   private:
    std::string source_;
    std::size_t pos_{0};

    void skip_whitespace();
};

const char* token_type_name(TokenType type);

}  // namespace calc
