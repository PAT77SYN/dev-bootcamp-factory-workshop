#include "lexer.h"

#include <gtest/gtest.h>

using calc::Lexer;
using calc::TokenType;

TEST(LexerTest, SingleNumber) {
    Lexer lexer("42");
    auto tok = lexer.next();
    EXPECT_EQ(tok.type, TokenType::NUMBER);
    EXPECT_EQ(tok.value, 42);
    EXPECT_EQ(lexer.next().type, TokenType::END);
}

TEST(LexerTest, AllOperators) {
    Lexer lexer("+-*/");
    EXPECT_EQ(lexer.next().type, TokenType::PLUS);
    EXPECT_EQ(lexer.next().type, TokenType::MINUS);
    EXPECT_EQ(lexer.next().type, TokenType::STAR);
    EXPECT_EQ(lexer.next().type, TokenType::SLASH);
    EXPECT_EQ(lexer.next().type, TokenType::END);
}

TEST(LexerTest, SkipsWhitespaceAndMixedExpr) {
    Lexer lexer("  12 + 30 ");
    auto a = lexer.next();
    EXPECT_EQ(a.type, TokenType::NUMBER);
    EXPECT_EQ(a.value, 12);
    EXPECT_EQ(lexer.next().type, TokenType::PLUS);
    auto b = lexer.next();
    EXPECT_EQ(b.type, TokenType::NUMBER);
    EXPECT_EQ(b.value, 30);
    EXPECT_EQ(lexer.next().type, TokenType::END);
}

TEST(LexerTest, EndIsIdempotent) {
    Lexer lexer("");
    EXPECT_EQ(lexer.next().type, TokenType::END);
    EXPECT_EQ(lexer.next().type, TokenType::END);
}

TEST(LexerTest, UnknownCharacterThrows) {
    Lexer lexer("1 ? 2");
    EXPECT_EQ(lexer.next().type, TokenType::NUMBER);
    EXPECT_THROW(lexer.next(), std::runtime_error);
}
