import pandas as pd

# Read the Excel file
df = pd.read_excel("scores.xlsx")

# Columns used to identify duplicates
duplicate_columns = [
    "github_username",
    "total_score",
    "strikes",
    "attempts",
    "last_checked_day"
]

# Count original rows
original_rows = len(df)

# Remove duplicates
cleaned_df = df.drop_duplicates(
    subset=duplicate_columns,
    keep="first"
)

# Count cleaned rows
cleaned_rows = len(cleaned_df)

# Calculate removed duplicates
duplicates_removed = original_rows - cleaned_rows

# Save cleaned file
output_file = "score_cleaned.xlsx"
cleaned_df.to_excel(output_file, index=False)

# Print summary
print("=" * 50)
print("DUPLICATE REMOVAL REPORT")
print("=" * 50)
print(f"Original Rows       : {original_rows}")
print(f"Rows After Cleaning : {cleaned_rows}")
print(f"Duplicates Removed  : {duplicates_removed}")
print(f"Cleaned File Saved  : {output_file}")
print("=" * 50)