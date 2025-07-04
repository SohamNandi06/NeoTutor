'use server';

import {auth, currentUser} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();
    const user = await currentUser();
    const authorName = user?.firstName;

    const { data, error } = await supabase
        .from('companions')
        .insert({...formData, author, authorName})
        .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();

  // Step 1: Get all companions with filters
  let query = supabase.from("companions").select("*");

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }else{
    console.log('No features found');
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;
  if (error || !companions) throw new Error(error.message);

  // Step 2: Get bookmarks for current user
  let bookmarkedIds: string[] = [];
  if (userId) {
    const { data: bookmarks, error: bookmarkErr } = await supabase
      .from("bookmarks")
      .select("companion_id")
      .eq("user_id", userId);

    if (!bookmarkErr && bookmarks) {
      bookmarkedIds = bookmarks.map((b) => b.companion_id);
    }
  }

  // Step 3: Attach `bookmarked: true` to companions
  const companionsWithBookmarks = companions.map((companion) => ({
    ...companion,
    bookmarked: bookmarkedIds.includes(companion.id),
  }));

  return companionsWithBookmarks;
};


export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id);

    if(error) return console.log(error);

    return data[0];
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    if(error) throw new Error(error.message);

    return data;
}

export const getRecentSessions = async (limit = 30) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserSessions = async (userId: string, limit = 30) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

let limit = 10;

if (has({ plan: 'pro_companion' })) {
  console.log('User has Pro Plan');
  return true;
} else if (has({ feature: "core" })) {
  console.log('User has 30 companion limit feature');
  limit = 30;
} else if (has({ feature: "basic" })) {
  console.log('User has 10 companion limit feature');
  limit = 10;
} else {
  console.warn('No plan or companion limit feature detected. Limit remains at 0');
}


  const {  count, error } = await supabase
    .from('companions')
    .select('id', { count: 'exact' })
    .eq('author', userId);

  if (error) throw new Error(error.message);

  return (count ?? 0) < limit;
};


// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  if (error) {
    throw new Error(error.message);
  }
  // Revalidate the path to force a re-render of the page

  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  // We don't need the bookmarks data, so we return only the companions
  return data.map(({ companions }) => companions);
};

export const getPopularCompanions = async (limit = 10) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('session_history')
    .select('companion_id, companions:companion_id(*)', { count: 'exact' })
    .order('companion_id', { ascending: false }) // optional, just for stable ordering
    .limit(1000); // large enough to aggregate from

  if (error || !data) throw new Error(error.message);

  // Step 1: Aggregate usage counts
  const usageMap: Record<string, { count: number, companion: Companion }> = {};

  data.forEach(({ companion_id, companions }) => {
    if (!companion_id || !companions) return;
    if (!usageMap[companion_id]) {
      usageMap[companion_id] = { count: 1, companion: companions };
    } else {
      usageMap[companion_id].count += 1;
    }
  });
    const sorted = Object.values(usageMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((entry) => entry.companion);

  return sorted;
};