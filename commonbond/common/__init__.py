import sys

def run(func, tests, usage, num_args):
    if sys.argv[1] == "test":
        test(func, tests)
    elif len(sys.argv) != num_args + 1:
        print usage % sys.argv[0]
    else:
        args = sys.argv
        args.pop(0)
        print func(args)

def test(func, tests):
    passed_tests = 0

    for test, expected in tests.iteritems():
        if func(test) != expected:
            subs = {'test': test,
                    'expected': expected,
                    'response': func(test)}
            print "\nFAIL test=%(test)s expected= %(expected)s response=%(response)s" % subs
        else:
            passed_tests += 1
            sys.stdout.write('.')

    print "\nTESTS PASSED: %d" % passed_tests
    print "TESTS FAILED: %d" % (len(tests) - passed_tests)
