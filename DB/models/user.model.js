import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    userName: {
        type: String,  
        required: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    phone: {
        type: String,
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: "offline"  
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    forgetCode: {
        type: String,
    },
    activationCode: {
        type: String,
    },
    profileImage: {
        url: {
            type: String,
            default: "https://res.cloudinary.com/dxdgxxsng/image/upload/v1715375934/project/notfound_tslkh5.jpg"
        },
        id: {
            type: String,
            default: "project/notfound_tslkh5"
        }
    },
    coverImages: [{ url: { type: String, required: true }, id: { type: String, required: true } }]
}, { timestamps: true });

export const User = mongoose.models.User || model('User', userSchema);
