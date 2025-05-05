package edu.bilkent.cs319.team9.ta_management_system.service;

import edu.bilkent.cs319.team9.ta_management_system.model.User;
import java.util.List;

import edu.bilkent.cs319.team9.ta_management_system.dto.*;
import java.util.List;

public interface UserService {
    UserProfileDto getMyProfile();
    void changeMyPassword(ChangePasswordRequest req);
    void changeMyContact(ChangeContactRequest req);
    List<NotificationDto> getMyNotifications();
    void recoverPassword(String email);
    void logout();
    User findById(Long id);
    void updateUserInfo(Long userId, UpdateUserInfoRequestDto dto);

}
