import { UserDataset, setUserDatasetDtoSchema, userIdSchema } from "common";
import { db, eq } from "db";
import express, { Router } from "express";
import { users } from "schema";

const userDatasetRouter: Router = express.Router();

userDatasetRouter.get("/:id", async (req, res) => {
  const userId = userIdSchema.safeParse(req.params.id);

  if (!userId.success) {
    res.status(400).send(userId.error.errors);
    return;
  }

  // TODO Add permission system, so that admins can read every user
  if (!req.user || req.user.id !== userId.data) {
    res.status(403).send("Unauthorized");
    return;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId.data),
    columns: { id: true, epilogDataset: true },
  });

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.json({
    timestamp: Date.now(),
    userId: user.id,
    epilogDataset: user.epilogDataset,
  } satisfies UserDataset);
});

userDatasetRouter.post("/:id", async (req, res) => {
  const userId = userIdSchema.safeParse(req.params.id);

  if (!userId.success) {
    res.status(400).send(userId.error.errors);
    return;
  }

  // TODO Add permission system, so that admins can edit every user
  if (!req.user || req.user.id !== userId.data) {
    res.status(403).send("Unauthorized");
    return;
  }

  console.log(req.body);

  const dto = setUserDatasetDtoSchema.safeParse(req.body);

  if (!dto.success) {
    res.status(400).send(dto.error.errors);
    return;
  }

  const user = await db
    .update(users)
    .set({ epilogDataset: dto.data.epilogDataset })
    .where(eq(users.id, userId.data));

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.json(user);
});

export default userDatasetRouter;
