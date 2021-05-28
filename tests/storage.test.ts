const storage = require("../storage");
const mockData = require("./mockAPIData");
import { MockContext, Context, createMockContext } from './context';
import { store, reportCountry, updateDB } from '../storage';

let mockCtx = MockContext;
let ctx = Context;


test('should create new user ', async () => {
  const canada = mockData.formatedCanada

  mockCtx.prisma.Country.create.mockResolvedValue(canada)

  await expect(store(canada)).resolves.toEqual({
    id: 124,
    name: 'Canada',
  })
})

// test('should update a users name ', async () => {
//   const user = { 
//     id: 1, 
//     name: 'Rich Haines', 
//     email: 'hello@prisma.io' 
//   }
//   mockCtx.prisma.user.update.mockResolvedValue(user)

//   await expect(updateUsername(user, ctx.prisma)).resolves.toEqual({
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//   })
// })

// test('should fail if user does not accept terms', async () => {
//   const user = { 
//     id: 1, 
//     name: 'Rich Haines', 
//     email: 'hello@prisma.io', 
//     acceptTermsAndConditions: false 
//   };

//   mockCtx.prisma.user.create.mockRejectedValue(new Error('User must accept terms!'));

//   await expect(createUser(user, ctx.prisma)).resolves.toEqual(new Error('User must accept terms!'));
// })

// test('should create new user ', async () => {
//   const canada = mockData.formatedCanada
//   const canadaStats = mockData.formatedCanada.stats

//   prismaMock.user.create.mockResolvedValue(user)

//   await expect(storage.store(canada)).resolves.toEqual({
//     id: 124,
//     name: 'Canada',
//     email: 'hello@prisma.io',
//     stats: canadaStats
//   })
// })

// test('should update a users name ', async () => {
//   const user = { 
//     id: 1, 
//     name: 'Rich Haines', 
//     email: 'hello@prisma.io' 
//   }

//   prismaMock.user.update.mockResolvedValue(user)

//   await expect(updateUsername(user)).resolves.toEqual({
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//   })
// })

// test('should fail if user does not accept terms', async () => {
//   const user = { 
//     id: 1, 
//     name: 'Rich Haines', 
//     email: 'hello@prisma.io', 
//     acceptTermsAndConditions: false 
//   };

//   prismaMock.user.create.mockRejectedValue(new Error('User must accept terms!'));

//   await expect(createUser(user)).resolves.toEqual(new Error('User must accept terms!'));
// })