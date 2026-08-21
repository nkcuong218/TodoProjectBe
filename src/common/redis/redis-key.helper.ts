export const RedisKey = {
  todoByUser: (userId: string) => {
    return `todo:${userId}`;
  },

  todoDetail: (todoId: string) => {
    return `todo-detail:${todoId}`;
  },

  userProfile: (userId: string) => {
    return `profile:${userId}`;
  },
}