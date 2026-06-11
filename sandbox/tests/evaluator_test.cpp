#include "evaluator.h"

#include <gtest/gtest.h>

#include "parser.h"

namespace {

std::int64_t eval_str(const char* src) {
    auto ast = calc::parse(src);
    return calc::evaluate(*ast);
}

}  // namespace

TEST(EvaluatorTest, Addition) { EXPECT_EQ(eval_str("1+2"), 3); }

TEST(EvaluatorTest, Multiplication) { EXPECT_EQ(eval_str("3*4"), 12); }

TEST(EvaluatorTest, IntegerDivisionTruncates) {
    EXPECT_EQ(eval_str("10/2"), 5);
    EXPECT_EQ(eval_str("7/2"), 3);
}

TEST(EvaluatorTest, Subtraction) { EXPECT_EQ(eval_str("5-3"), 2); }

TEST(EvaluatorTest, MixedPrecedence) {
    EXPECT_EQ(eval_str("1+2*3"), 7);
    EXPECT_EQ(eval_str("2*3+4"), 10);
    EXPECT_EQ(eval_str("20-6/2"), 17);
}

TEST(EvaluatorTest, DivisionByZeroThrows) {
    EXPECT_THROW(eval_str("1/0"), std::runtime_error);
}
