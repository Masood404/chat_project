export const generateUsersString = (users, selfId) => {
    if (selfId) {
        // Filter out the other users from the users array
        const otherUsers = users.filter(user => user.id !== selfId);

        // If there is only one other user then only return their username
        if (otherUsers.length === 1) return otherUsers[0].username;

        else if (otherUsers.length > 1) {
            // Get all the other usernames
            const usernames = otherUsers.map(user => user.username);
            // The first three users will be displayed as username1, username2, username3
            const displayedUsernames = usernames.slice(0, 3).join(', ');
            // The extra count number if there are more tha three other users
            const extraCount = otherUsers.length - 3;
            
            return extraCount > 0
                // For example, "username1, username2, username3, 2+" would be displayed if there are exacly 5 users
                ? `${displayedUsernames}, ${extraCount}+`
                // For example, "username1, username2, username3" would be displayed if there are exacly 3 users
                : displayedUsernames;
        }
    }

    return 'Empty Chat';
};