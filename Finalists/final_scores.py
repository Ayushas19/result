import pandas as pd

# ==========================================
# FILE PATHS
# ==========================================

score_file = "score_cleaned.xlsx"
evaluation_file = "final_evaluation_results.csv"

output_file = "score_with_final_scores.xlsx"

# ==========================================
# LOAD FILES
# ==========================================

score_df = pd.read_excel(score_file)

evaluation_df = pd.read_csv(evaluation_file)

# ==========================================
# CREATE LOOKUP DICTIONARY
# username -> final_score_out_of_10
# ==========================================

score_lookup = dict(
    zip(
        evaluation_df["username"],
        evaluation_df["final_score_out_of_10"]
    )
)

# ==========================================
# ADD final_score_out_of_10 COLUMN
# ==========================================

score_df["final_score_out_of_10"] = (
    score_df["github_username"]
    .map(score_lookup)
    .fillna(0)
)

# ==========================================
# CREATE Total_Final_Scores
# ==========================================

score_df["Total_Final_Scores"] = (
    score_df["total_score"] +
    score_df["final_score_out_of_10"]
)

# ==========================================
# SAVE OUTPUT
# ==========================================

score_df.to_excel(
    output_file,
    index=False
)

# ==========================================
# REPORT
# ==========================================

matched_users = (
    score_df["github_username"]
    .isin(evaluation_df["username"])
    .sum()
)

not_matched_users = (
    len(score_df) - matched_users
)

print("=" * 60)
print("FINAL SCORE MERGE REPORT")
print("=" * 60)
print(f"Total Users               : {len(score_df)}")
print(f"Matched Users             : {matched_users}")
print(f"Unmatched Users (Score 0) : {not_matched_users}")
print(f"Output File               : {output_file}")
print("=" * 60)