import random
from bjkst_ref_main import algorithm, read_words

# Load dataset tokens (Spotify artist stream / words)
stream = read_words("top_10000_1950-now.csv")
true_d = 3813  # True distinct count

# Run across 8,000 independent hash seeds
errors = []
for seed in range(8000):
    random.seed(seed)
    est = algorithm(stream, epsilon=0.5)
    err = (est - true_d) / true_d * 100.0
    errors.append(err)

# Compute distribution statistics
mean_err = sum(errors) / len(errors)
exceed_count = sum(1 for e in errors if abs(e) > 50)

print(f"Mean Error: {mean_err:.2f}% | Exceeding 50%: {exceed_count}")
