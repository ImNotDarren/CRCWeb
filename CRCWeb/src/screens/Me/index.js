import { Alert, Platform, RefreshControl, ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Menu } from "@ui-kitten/components";
import { remove } from "@/localStorage";
import InitialsAvatar from "@/src/components/Avatar";
import { UserMenuItem } from "./UserMenuItem";
import getStyles from "./style";
import { CustomizeMenuItem } from "@/src/components/CustomizeMenuItem";
import { alert } from "@/utils/alert";
import { useRouter } from "expo-router";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || '';

const AVATAR_SIZE = 90;

export default function MeScreen() {
  const router = useRouter();

  const user = useSelector((state) => state.user);
  const fontSize = useSelector((state) => state.font.fontSize);
  const styles = getStyles(fontSize);
  
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK', onPress: () => {
            remove('autoLogin');
            router.replace('/login');
            dispatch({ type: 'UPDATE_USER', value: {} });
            dispatch({ type: 'UPDATE_MODULES', value: [] });
          }
        }
      ]
    )
  }

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const userRes = await fetch(`${SERVER_URL}/user/${user.user.id}`, {
        method: 'GET',
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        dispatch({ type: 'UPDATE_USER', value: userData });
      }

      const permissionsRes = await fetch(`${SERVER_URL}/crc/permission/findByUserId/${user.user.id}`, {
        method: 'GET',
      });


      if (permissionsRes.ok) {
        const permissionsData = await permissionsRes.json();
        dispatch({ type: 'UPDATE_PERMISSIONS', value: permissionsData });
      }
      setRefreshing(false);
    } catch (error) {
      console.error(error);
      setRefreshing(false);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.userinfoContainer}>
        <InitialsAvatar name={`${user.user.firstName} ${user.user.lastName}`} size={AVATAR_SIZE} />
        <View style={styles.userinfo(AVATAR_SIZE)}>
          <Text style={styles.username}>{user.user.firstName} {user.user.lastName}</Text>
          <Text style={styles.role}>{`${user.user.featureUsers[3].role[0].toUpperCase()}${user.user.featureUsers[3].role.substring(1)}`}</Text>
          <Text style={styles.email}>{user.user.email}</Text>
        </View>
      </View>
      {/* <Button
        style={styles.editButton}
        status='primary'
        appearance='outline'
        onPress={() => { }}
      >
        Edit Profile
      </Button> */}
      <ScrollView style={styles.menu}
        // refreshing={refreshing}
        // onRefresh={handleRefresh}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {['admin', 'superadmin'].includes(user.user.featureUsers[3].role.toLowerCase()) && <CustomizeMenuItem title='Manage Accounts' icon='account-cog' onNavigate={() => router.push('/manage-accounts')} />}
        <CustomizeMenuItem title='Settings' icon='cog' onNavigate={() => router.push('/settings')} />
        <CustomizeMenuItem title='Paired Accounts' icon='account-multiple' onNavigate={() => router.push('/paired-accounts')} />
        <CustomizeMenuItem title='Switch Version' icon='swap-horizontal-bold' onNavigate={() => router.replace('/versions')} />
        {Array.isArray(user?.permissions)
          && user.permissions.find(p => p.type === "activity") &&
          // Platform.OS === 'ios' &&
          <CustomizeMenuItem title='Activity' icon='run' onNavigate={() => router.push('/activity')} />}
        {/* <CustomizeMenuItem title='Discussion' icon='forum' onNavigate={() => router.push('/discussion')} /> */}
        <CustomizeMenuItem title='Contact Us' icon='account-box' onNavigate={() => router.push('/contact')} />
        <CustomizeMenuItem title='Logout' icon='logout' onNavigate={handleLogout} />
        <View style={{ height: 100 }} />
      </ScrollView>
      {/* <Divider
        style={styles.divider}
      /> */}
    </View>
  );
}