import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Color palette for auto-assigned avatars
const AVATAR_COLORS = [
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#0EA5E9", // sky
  "#F59E0B", // amber
  "#EF4444", // red
  "#14B8A6", // teal
  "#D946EF", // fuchsia
  "#10B981", // emerald
  "#6366F1", // indigo
  "#F97316", // orange
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    // First 2 uppercase initials of name (e.g. "Mann Verma" → "MV")
    avatar: {
      type: String,
      default: "",
    },
    // Random color from AVATAR_COLORS
    avatarColor: {
      type: String,
      default: "",
    },
    // Profile picture URL (optional, for future Cloudinary upload)
    profilePic: {
      type: String,
      default: "",
    },
    online: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ── Pre-save: Hash password + generate avatar initials and color ──
userSchema.pre("save", async function () {
  // Hash password only if it was modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Auto-generate avatar initials from name
  if (this.isModified("name") || !this.avatar) {
    const parts = this.name ? this.name.trim().split(" ").filter(Boolean) : [];
    if (parts.length >= 2) {
      this.avatar = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts.length === 1) {
      this.avatar = parts[0].substring(0, 2).toUpperCase();
    } else {
      this.avatar = "M";
    }
  }

  // Auto-assign avatar color if not set
  if (!this.avatarColor) {
    const idx = Math.floor(Math.random() * AVATAR_COLORS.length);
    this.avatarColor = AVATAR_COLORS[idx];
  }
});

// ── Instance method: Compare password ──
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Remove password from JSON output ──
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
