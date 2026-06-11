cmake_minimum_required(VERSION 3.20)
project(calc CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Library with the calculator core, shared between the binary and the tests.
add_library(calc_core STATIC
    src/lexer.cpp
    src/parser.cpp
    src/evaluator.cpp
)
target_include_directories(calc_core PUBLIC src)

# REPL binary.
add_executable(calc src/main.cpp)
target_link_libraries(calc PRIVATE calc_core)

# ---------------------------------------------------------------------------
# Tests (GoogleTest via FetchContent, no system install needed).
# ---------------------------------------------------------------------------
include(CTest)
if(BUILD_TESTING)
    include(FetchContent)
    FetchContent_Declare(
        googletest
        GIT_REPOSITORY https://github.com/google/googletest.git
        GIT_TAG v1.14.0
    )
    set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
    FetchContent_MakeAvailable(googletest)

    include(GoogleTest)

    add_executable(lexer_test tests/lexer_test.cpp)
    target_link_libraries(lexer_test PRIVATE calc_core GTest::gtest_main)
    gtest_discover_tests(lexer_test)

    add_executable(parser_test tests/parser_test.cpp)
    target_link_libraries(parser_test PRIVATE calc_core GTest::gtest_main)
    gtest_discover_tests(parser_test)

    add_executable(evaluator_test tests/evaluator_test.cpp)
    target_link_libraries(evaluator_test PRIVATE calc_core GTest::gtest_main)
    gtest_discover_tests(evaluator_test)
endif()
