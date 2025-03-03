import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

interface VerificationRequest {
    phone: string;
    nic: string;
    token: string;
}

// Maximum number of verification attempts allowed
const MAX_VERIFICATION_ATTEMPTS = 3;

export const verifyProfile = functions.https.onCall(async (data: VerificationRequest, context) => {
    try {
        const { phone, nic, token } = data;

        if (!phone || !nic || !token) {
            throw new functions.https.HttpsError(
                "invalid-argument",
                "Phone, NIC and token are required"
            );
        }

        // Get the token document
        const tokenDoc = await admin.firestore()
            .collection("profileTokens")
            .doc(token)
            .get();

        if (!tokenDoc.exists) {
            throw new functions.https.HttpsError(
                "not-found",
                "Invalid verification token"
            );
        }

        const tokenData = tokenDoc.data();
        
        // Check if token is expired
        if (tokenData?.expiresAt.toDate() < new Date()) {
            // Delete expired token
            await tokenDoc.ref.delete();
            throw new functions.https.HttpsError(
                "failed-precondition",
                "Verification link has expired"
            );
        }

        // Check if token is already verified
        if (tokenData?.isVerified) {
            throw new functions.https.HttpsError(
                "failed-precondition",
                "This link has already been verified"
            );
        }

        // Check if max attempts reached
        if (tokenData?.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
            // Delete the token document if max attempts reached
            await tokenDoc.ref.delete();
            throw new functions.https.HttpsError(
                "resource-exhausted",
                "Maximum verification attempts reached. Please request a new verification link."
            );
        }

        // Increment verification attempts
        await tokenDoc.ref.update({
            verificationAttempts: admin.firestore.FieldValue.increment(1)
        });

        // Get the family document to verify against
        const familyDoc = await admin.firestore()
            .collection("families")
            .doc(tokenData?.familyId)
            .get();

        if (!familyDoc.exists) {
            throw new functions.https.HttpsError(
                "not-found",
                "Family not found"
            );
        }

        const familyData = familyDoc.data();
        
        // Verify the phone and NIC
        if (familyData?.phone !== phone || familyData?.nic !== nic) {
            // Check if this was the last attempt
            if (tokenData?.verificationAttempts + 1 >= MAX_VERIFICATION_ATTEMPTS) {
                // Delete the token document on last failed attempt
                await tokenDoc.ref.delete();
                throw new functions.https.HttpsError(
                    "permission-denied",
                    "Invalid verification details. Maximum attempts reached. Please request a new verification link."
                );
            }
            throw new functions.https.HttpsError(
                "permission-denied",
                `Invalid verification details. ${MAX_VERIFICATION_ATTEMPTS - (tokenData?.verificationAttempts + 1)} attempts remaining.`
            );
        }

        // Mark token as verified
        await tokenDoc.ref.update({
            isVerified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Return the family data
        return {
            success: true,
            familyData: {
                id: familyDoc.id,
                ...familyData
            }
        };

    } catch (error) {
        console.error("Profile verification error:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError(
            "internal",
            "Failed to verify profile"
        );
    }
});