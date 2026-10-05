import csv
import random
import statistics

# Mersenne prime p = 2^61 - 1 used for 2-universal hash family h(x) = (a*x + b) mod p
P = (1 << 61) - 1
B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

def enc(uri):
    """Map Spotify Artist URI to an integer modulo P using base-62 encoding."""
    x = 0
    for ch in uri.split(":")[-1]:
        if ch in B62:
            x = (x * 62 + B62.index(ch)) % P
    return x

def zeros(v):
    """Count number of trailing zero bits."""
    return 61 if v == 0 else (v & -v).bit_length() - 1

def bjkst_func(stream, capacity=2304, seed=42):
    """
    Core BJKST algorithm function for a single hash seed.
    Returns estimated distinct count.
    """
    rng = random.Random(seed)
    a, b = rng.randrange(1, P), rng.randrange(P)
    
    z, B = 0, {}
    for u in stream:
        zz = zeros((a * enc(u) + b) % P)
        if zz >= z:
            B[u] = zz
            while len(B) >= capacity:
                z += 1
                B = {k: v for k, v in B.items() if v >= z}
    return len(B) * (2 ** z)

def run_monte_carlo_8000(stream, true_distinct=3813, capacity=2304):
    """Run across 8,000 independent hash seeds and compute distribution statistics."""
    errors = []
    
    distinct_artists = list(set(stream))
    encoded_distinct = [enc(u) for u in distinct_artists]
    
    for seed in range(8000):
        rng = random.Random(seed)
        a, b = rng.randrange(1, P), rng.randrange(P)
        z_counts = [zeros((a * x + b) % P) for x in encoded_distinct]
        
        z = 0
        y_z = len(z_counts)
        while y_z >= capacity:
            z += 1
            y_z = sum(1 for val in z_counts if val >= z)
            
        est = y_z * (2 ** z)
        err = (est - true_distinct) / true_distinct * 100
        errors.append(err)
        
    mean_err = sum(errors) / len(errors)
    stdev_err = statistics.stdev(errors)
    exceed_count = sum(1 for e in errors if abs(e) > 50)
    
    print(f"8,000-Seed Monte Carlo Results:")
    print(f"Mean Error: {mean_err:+.2f}% | Std Dev: {stdev_err:.2f}% | Exceeding 50% bound: {exceed_count}")

if __name__ == "__main__":
    with open("dist/top_10000_1950-now.csv", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    stream = [u.strip() for r in rows for u in r["Artist URI(s)"].split(",") if u.strip()]
    run_monte_carlo_8000(stream)
