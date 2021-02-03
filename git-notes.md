https://www.freecodecamp.org/news/how-to-use-branches-in-git/

https://www.freecodecamp.org/news/how-to-undo-mistakes-with-git/

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

# This also works the other way around: when creating a local branch that should be based on a remote one. In other words, when you want to track a remote branch:

git branch --track <new-branch> origin/<base-branch>

# Alternatively, you could also use the git checkout command to achieve this. If you want to name the local branch after the remote one, you only have to specify the remote branch's name:

git checkout --track origin/<base-branch>

# Delete local branch

git branch -d <branch-name>

# Note that you might also need the -f option in case you're trying to delete a branch that contains un-merged changes. Use this option with care because it makes losing data very easy!

# To delete a remote branch, we cannot use the git branch command. Instead, git push will do the trick, using the --delete flag:

git push origin --delete <branch-name>

# Merging is probably the most popular way to integrate changes. It allows you to bring all of the new commits from another branch into your current HEAD branch.
# One of the great things about Git is that merging branches is so simple and stress-free. It requires just two steps:

# (1) Check out the branch that should receive the changes
git switch main
	
# (2) Execute the "merge" command with the name of the branch that contains the desired changes
git merge feature/contact-form


# An alternative way to integrate commits from another branch is using rebase. And I'm very careful to call it an "alternative" way: it's not better or worse, but simply different.

# (1) Check out the branch that should receive the changes
git switch feature/contact-form
	
# (2) Execute the "rebase" command with the name of the branch that contains the desired changes
git rebase main

# Comparing branches
# To see which commits are in branch-B but not in branch-A, you can use the git log command with the double dot syntax:

git log branch-A..branch-B

# Of course, you could also use this to compare your local and remote states by writing something like

git log main..origin/main



# GIT UNDO MISTAKES

git status
git diff <filename>
git restore <filename>

# Discarding local uncommited changes cannot be undone
# Discarding all uncommited changes
git restore .


# Updating the commit message
git commit --amend -m "New message for the commit"
