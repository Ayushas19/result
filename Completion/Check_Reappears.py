import pandas as pd

score_df = pd.read_excel("score_cleaned.xlsx")
elim_df = pd.read_excel("eliminated_cleaned.xlsx")

score_users = set(
    score_df["github_username"]
    .astype(str)
    .str.strip()
    .str.lower()
)

elim_users = set(
    elim_df["github_username"]
    .astype(str)
    .str.strip()
    .str.lower()
)

common_users = score_users.intersection(elim_users)

print("Users present in BOTH files:")
print("-" * 40)

for user in sorted(common_users):
    print(user)

print("\nTotal:", len(common_users))