export function setAuthCookie(res, userId) {
    res.setHeader(
      "Set-Cookie",
      `userId=${userId}; Path=/; HttpOnly; SameSite=Strict`
    );
  }