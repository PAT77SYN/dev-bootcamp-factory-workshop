#include "parser.h"

#include <gtest/gtest.h>

using calc::BinOp;
using calc::NodeKind;
using calc::parse;

TEST(ParserTest, SingleNumber) {
    auto ast = parse("7");
    ASSERT_EQ(ast->kind, NodeKind::Number);
    EXPECT_EQ(ast->value, 7);
}

TEST(ParserTest, FlatAdditionIsLeftAssociative) {
    // 1 + 2 + 3 -> ((1 + 2) + 3)
    auto ast = parse("1 + 2 + 3");
    ASSERT_EQ(ast->kind, NodeKind::BinaryOp);
    EXPECT_EQ(ast->op, BinOp::Add);
    ASSERT_EQ(ast->left->kind, NodeKind::BinaryOp);
    EXPECT_EQ(ast->left->op, BinOp::Add);
    EXPECT_EQ(ast->left->left->value, 1);
    EXPECT_EQ(ast->left->right->value, 2);
    ASSERT_EQ(ast->right->kind, NodeKind::Number);
    EXPECT_EQ(ast->right->value, 3);
}

TEST(ParserTest, MulBindsTighterThanAdd) {
    // 1 + 2 * 3 -> (1 + (2 * 3))
    auto ast = parse("1 + 2 * 3");
    ASSERT_EQ(ast->kind, NodeKind::BinaryOp);
    EXPECT_EQ(ast->op, BinOp::Add);
    ASSERT_EQ(ast->left->kind, NodeKind::Number);
    EXPECT_EQ(ast->left->value, 1);
    ASSERT_EQ(ast->right->kind, NodeKind::BinaryOp);
    EXPECT_EQ(ast->right->op, BinOp::Mul);
}

TEST(ParserTest, TrailingTokenThrows) {
    EXPECT_THROW(parse("1 2"), std::runtime_error);
}

TEST(ParserTest, MissingOperandThrows) {
    EXPECT_THROW(parse("1 +"), std::runtime_error);
}
