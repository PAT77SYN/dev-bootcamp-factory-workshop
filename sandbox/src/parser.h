#pragma once

#include <cstdint>
#include <memory>
#include <string_view>

#include "lexer.h"

namespace calc {

// Tiny AST. Three node types, one shared base. We use raw enums and
// std::unique_ptr children — simple structs over deep OOP.

enum class NodeKind {
    Number,
    BinaryOp,
};

enum class BinOp {
    Add,
    Sub,
    Mul,
    Div,
};

struct Node {
    NodeKind kind;

    // Number payload
    std::int64_t value{0};

    // BinaryOp payload
    BinOp op{BinOp::Add};
    std::unique_ptr<Node> left;
    std::unique_ptr<Node> right;
};

using NodePtr = std::unique_ptr<Node>;

// Parse a full expression from `source`. Throws std::runtime_error on
// syntactic problems (unexpected tokens, trailing input, etc.).
NodePtr parse(std::string_view source);

}  // namespace calc
