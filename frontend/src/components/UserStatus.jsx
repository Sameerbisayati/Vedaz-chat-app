function UserStatus({
  user,
  currentUser
}) {
  const isCurrent =
    user._id === currentUser._id;

  const getLastSeen = () => {
    if (!user.lastSeen) {
      return "Offline";
    }

    return `Last seen ${new Date(
      user.lastSeen
    ).toLocaleString([], {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  };

  return (
    <div className="user-status">
      <div className="user-status-avatar">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.username}
          />
        ) : (
          <div className="avatar-fallback">
            {user.username
              .charAt(0)
              .toUpperCase()}
          </div>
        )}

        {user.isOnline && (
          <span className="status-dot" />
        )}
      </div>

      <div className="user-status-info">
        <strong>
          {user.username}
          {isCurrent && " (You)"}
        </strong>

        <span
          className={
            user.isOnline
              ? "online-text"
              : "offline-text"
          }
        >
          {user.isOnline
            ? "Online"
            : getLastSeen()}
        </span>
      </div>
    </div>
  );
}

export default UserStatus;