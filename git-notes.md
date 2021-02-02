# to get it locally
git clone repo_path_here
# check status
git status
# staging changes to a file
git add relative_path_to_file
# staging changes to all files
git add .
# commiting locally
git commit -m "message here"
# to push to GitHub remote depository
git push origin main
# to get the changes from GitHub remote depository but not merging
git fetch
git status
# to get the changes from GitHub remote depository with merging if no conflicts
git pull


# Branches
# Creating

git branch <new-branch-name>

# When providing just a name to the git branch command, Git will assume that you want to start your new branch based on your currently checked out revision. If you'd like your new branch to start at a specific revision, you can simply add the revision's SHA-1 hash:

git branch <new-branch-name> 89a2faad
# Renaming
# to rename a local branch. If you want to rename your current HEAD branch, you can use the following command:

git branch -m <new-name>

# In case you'd like to rename a different local branch (which is NOT currently checked out), you'll have to provide the old and the new name:

git branch -m <old-name> <new-name>

# Git doesn't allow you to rename remote branches.
# In practice, renaming a remote branch can be done by deleting the old one and then pushing up the new one from your local repository:
# First, delete the current / old branch:

git push origin #delete <old-name>

# Then, simply push the new local branch with the correct name:

git push -u origin <new-name>

# The current branch (also referred to as the HEAD branch) defines the context you're working in at the moment. Or in other words: the current HEAD branch is where new commits will be created.

git checkout <other-branch>

# or

git switch <other-branch>

# it's not possible to create a new branch on a remote repository.

git push -u origin <local-branch>
# -u flag it tells Git to establish a "tracking connection" which will make pushing and pulling much easier in the future.

