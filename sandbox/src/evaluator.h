#pragma once

#include <cstdint>

#include "parser.h"

namespace calc {

// Walk the AST and return the integer result. Throws std::runtime_error
// on division by zero. Pure integer arithmetic — no floats.
std::int64_t evaluate(const Node& node);

}  // namespace calc
