import pandas as pd

# Competition start date
START_DATE = pd.to_datetime("14-03-2026", dayfirst=True)

# Read files
score_df = pd.read_excel("score_cleaned.xlsx")
eliminated_df = pd.read_excel("eliminated_cleaned.xlsx")

# Convert eliminated_date to datetime
eliminated_df["eliminated_date"] = pd.to_datetime(
    eliminated_df["eliminated_date"],
    dayfirst=True,
    errors="coerce"
)

# Calculate survival days
eliminated_df["survival_days"] = (
    eliminated_df["eliminated_date"] - START_DATE
).dt.days

# Keep only users surviving 30+ days
survived_30 = eliminated_df[
    eliminated_df["survival_days"] >= 30
].copy()

# Usernames present in score_cleaned.xlsx
score_usernames = set(
    score_df["github_username"].astype(str).str.strip().str.lower()
)

# Remove users already present in score_cleaned.xlsx
final_df = survived_30[
    ~survived_30["github_username"]
        .astype(str)
        .str.strip()
        .str.lower()
        .isin(score_usernames)
].copy()

# Sort by survival days (optional)
final_df = final_df.sort_values(
    by="survival_days",
    ascending=False
)

# Save file
output_file = "30_Days.xlsx"
final_df.to_excel(output_file, index=False)

# Statistics
print("=" * 60)
print("30+ DAYS SURVIVORS REPORT")
print("=" * 60)
print(f"Total Eliminated Users               : {len(eliminated_df)}")
print(f"Users Survived 30+ Days              : {len(survived_30)}")
print(f"Users Found In score_cleaned.xlsx    : {len(survived_30) - len(final_df)}")
print(f"Final Users In 30_Days.xlsx          : {len(final_df)}")
print(f"Output File                          : {output_file}")
print("=" * 60)